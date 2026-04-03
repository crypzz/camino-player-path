export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      const str = val == null ? '' : String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPlayerReportPDF(player: { name: string; position: string; team: string; overall_rating: number }) {
  // Generate a simple text-based report that opens in a new window for printing as PDF
  const content = `
    <html><head><title>${player.name} - Player Report</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; }
      h1 { color: #0D0F14; border-bottom: 2px solid #E8B400; padding-bottom: 8px; }
      .stat { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .label { font-weight: 600; }
    </style></head><body>
    <h1>Player Report: ${player.name}</h1>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
    <div class="stat"><span class="label">Position</span><span>${player.position}</span></div>
    <div class="stat"><span class="label">Team</span><span>${player.team}</span></div>
    <div class="stat"><span class="label">CPI Score</span><span>${player.overall_rating}</span></div>
    <br/><p><em>Print this page to save as PDF (Ctrl+P / Cmd+P)</em></p>
    </body></html>
  `;
  const win = window.open('', '_blank');
  if (win) { win.document.write(content); win.document.close(); }
}
