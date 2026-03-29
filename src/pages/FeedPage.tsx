import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import { PlayerOfTheWeek } from '@/components/PlayerOfTheWeek';
import { Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeedPage() {
  const { data: posts = [], isLoading } = usePosts();

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            Feed
          </h1>
          <p className="text-muted-foreground text-[13px] mt-0.5">Updates from the community</p>
        </div>
        <CreatePostDialog />
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground text-sm">Loading feed...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>

        <div className="hidden lg:block space-y-4">
          <PlayerOfTheWeek />
        </div>
      </div>
    </div>
  );
}
