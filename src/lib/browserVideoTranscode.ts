import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const HEVC_MARKERS = ['hvc1', 'hev1', 'dvh1', 'dvhe'];
const QUICKTIME_EXTS = ['mov', 'qt'];

function includesAsciiMarker(bytes: Uint8Array, marker: string) {
  const code = Array.from(marker, ch => ch.charCodeAt(0));
  for (let i = 0; i <= bytes.length - code.length; i += 1) {
    let match = true;
    for (let j = 0; j < code.length; j += 1) {
      if (bytes[i + j] !== code[j]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}

export async function shouldTranscodeForBrowser(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (QUICKTIME_EXTS.includes(ext)) return true;

  const probeSize = Math.min(file.size, 2 * 1024 * 1024);
  const chunks = [new Uint8Array(await file.slice(0, probeSize).arrayBuffer())];
  if (file.size > probeSize) {
    chunks.push(new Uint8Array(await file.slice(Math.max(0, file.size - probeSize)).arrayBuffer()));
  }

  return chunks.some(chunk => HEVC_MARKERS.some(marker => includesAsciiMarker(chunk, marker)));
}

export async function readVideoDuration(file: File): Promise<number | undefined> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Could not read video duration'));
    });
    return Number.isFinite(video.duration) ? video.duration : undefined;
  } catch {
    return undefined;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function transcodeToBrowserMp4(file: File, onProgress: (pct: number) => void): Promise<File> {
  const ffmpeg = new FFmpeg();
  const inputName = `input.${file.name.split('.').pop() || 'mp4'}`;
  const outputName = 'output.mp4';

  ffmpeg.on('progress', ({ progress }) => {
    if (Number.isFinite(progress)) onProgress(Math.max(1, Math.min(99, Math.round(progress * 100))));
  });

  try {
    const [coreURL, wasmURL] = await Promise.all([
      toBlobURL('/ffmpeg/ffmpeg-core.js', 'text/javascript'),
      toBlobURL('/ffmpeg/ffmpeg-core.wasm', 'application/wasm'),
    ]);

    await ffmpeg.load({ coreURL, wasmURL });
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    const code = await ffmpeg.exec([
      '-i', inputName,
      '-map', '0:v:0',
      '-map', '0:a?',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '26',
      '-vf', 'scale=min(1280\\,iw):-2',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      outputName,
    ], 180000);

    if (code !== 0) throw new Error('Video conversion failed');
    const output = await ffmpeg.readFile(outputName);
    const raw = typeof output === 'string' ? new TextEncoder().encode(output) : output;
    const bytes = new Uint8Array(raw.byteLength);
    bytes.set(raw as Uint8Array);
    const arrayBuffer = bytes.buffer;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    return new File([arrayBuffer], `${baseName}_playable.mp4`, { type: 'video/mp4' });
  } finally {
    ffmpeg.terminate();
  }
}