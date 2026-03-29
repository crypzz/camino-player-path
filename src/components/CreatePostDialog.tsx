import { useState, useRef } from 'react';
import { ImagePlus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreatePost } from '@/hooks/usePosts';
import { toast } from 'sonner';

export function CreatePostDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const createPost = useCreatePost();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) return;
    try {
      await createPost.mutateAsync({ content: content.trim(), imageFile: imageFile || undefined });
      toast.success('Post shared!');
      setContent('');
      setImageFile(null);
      setPreview(null);
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to post');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <Send className="h-4 w-4" />
            New Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share an Update</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's happening on the pitch?"
            className="min-h-[100px] resize-none"
          />
          {preview && (
            <div className="relative">
              <img src={preview} alt="Preview" className="rounded-lg max-h-48 w-full object-cover" />
              <button
                onClick={() => { setImageFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} className="gap-2 text-muted-foreground">
              <ImagePlus className="h-4 w-4" />
              Add Photo
            </Button>
            <Button onClick={handleSubmit} size="sm" disabled={createPost.isPending || (!content.trim() && !imageFile)}>
              {createPost.isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
