import { usePosts } from '@/hooks/usePosts';
import { PostCard } from './PostCard';
import { ImageIcon } from 'lucide-react';

interface Props {
  playerId: string;
}

export function PlayerPostsGrid({ playerId }: Props) {
  const { data: posts = [], isLoading } = usePosts(playerId);

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground text-sm">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No posts yet</p>
      </div>
    );
  }

  // Instagram-style grid for image posts, list for text posts
  const imagePosts = posts.filter(p => p.image_url);
  const textPosts = posts.filter(p => !p.image_url);

  return (
    <div className="space-y-4">
      {imagePosts.length > 0 && (
        <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
          {imagePosts.map(post => (
            <div key={post.id} className="aspect-square relative group cursor-pointer">
              <img src={post.image_url!} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs">
                <span>❤ {post.likes_count}</span>
                <span>💬 {post.comments_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {textPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
