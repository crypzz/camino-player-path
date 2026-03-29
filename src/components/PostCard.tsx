import { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Post, useToggleLike, useAddComment, usePostComments } from '@/hooks/usePosts';
import { motion } from 'framer-motion';

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const { data: comments = [] } = usePostComments(showComments ? post.id : '');

  const displayName = post.profiles?.display_name || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLike = () => {
    toggleLike.mutate({ postId: post.id, liked: post.user_has_liked });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment.mutate({ postId: post.id, content: comment.trim() });
    setComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={post.profiles?.avatar_url || undefined} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{displayName}</p>
          <p className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 text-sm text-foreground/90 leading-relaxed">{post.content}</p>
      )}

      {/* Image */}
      {post.image_url && (
        <div className="relative">
          <img src={post.image_url} alt="" className="w-full max-h-96 object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-border/50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${post.user_has_liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
        >
          <Heart className={`h-4 w-4 ${post.user_has_liked ? 'fill-current' : ''}`} />
          <span>{post.likes_count}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments_count}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-border/50 px-4 py-3 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground shrink-0 mt-0.5">
                {(c.profiles?.display_name || 'U')[0]}
              </div>
              <div>
                <p className="text-xs"><span className="font-medium text-foreground">{c.profiles?.display_name || 'User'}</span> <span className="text-muted-foreground">{c.content}</span></p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2">
            <Input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="h-8 text-xs"
            />
            <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 shrink-0" disabled={!comment.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
