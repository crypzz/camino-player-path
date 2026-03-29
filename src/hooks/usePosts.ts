import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Post {
  id: string;
  user_id: string;
  player_id: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
  players?: { name: string; avatar: string | null } | null;
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
}

export function usePosts(playerId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['posts', playerId],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*, profiles!posts_user_id_fkey(display_name, avatar_url), players(name, avatar)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (playerId) query = query.eq('player_id', playerId);

      const { data: posts, error } = await query;
      if (error) {
        // Fallback without join if FK doesn't exist
        const { data: fallbackPosts, error: fbError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (fbError) throw fbError;
        
        // Get likes and comments counts
        const postIds = (fallbackPosts || []).map(p => p.id);
        const [likesRes, commentsRes, userLikesRes] = await Promise.all([
          supabase.from('post_likes').select('post_id').in('post_id', postIds),
          supabase.from('post_comments').select('post_id').in('post_id', postIds),
          user ? supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postIds) : Promise.resolve({ data: [] }),
        ]);

        const likeCounts: Record<string, number> = {};
        const commentCounts: Record<string, number> = {};
        const userLikedSet = new Set<string>();

        (likesRes.data || []).forEach(l => { likeCounts[l.post_id] = (likeCounts[l.post_id] || 0) + 1; });
        (commentsRes.data || []).forEach(c => { commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1; });
        ((userLikesRes as any).data || []).forEach((l: any) => userLikedSet.add(l.post_id));

        return (fallbackPosts || []).map(p => ({
          ...p,
          profiles: null,
          players: null,
          likes_count: likeCounts[p.id] || 0,
          comments_count: commentCounts[p.id] || 0,
          user_has_liked: userLikedSet.has(p.id),
        })) as Post[];
      }

      // Get likes and comments counts
      const postIds = (posts || []).map(p => p.id);
      if (postIds.length === 0) return [] as Post[];

      const [likesRes, commentsRes, userLikesRes] = await Promise.all([
        supabase.from('post_likes').select('post_id').in('post_id', postIds),
        supabase.from('post_comments').select('post_id').in('post_id', postIds),
        user ? supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postIds) : Promise.resolve({ data: [] }),
      ]);

      const likeCounts: Record<string, number> = {};
      const commentCounts: Record<string, number> = {};
      const userLikedSet = new Set<string>();

      (likesRes.data || []).forEach(l => { likeCounts[l.post_id] = (likeCounts[l.post_id] || 0) + 1; });
      (commentsRes.data || []).forEach(c => { commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1; });
      ((userLikesRes as any).data || []).forEach((l: any) => userLikedSet.add(l.post_id));

      return (posts || []).map(p => ({
        ...p,
        likes_count: likeCounts[p.id] || 0,
        comments_count: commentCounts[p.id] || 0,
        user_has_liked: userLikedSet.has(p.id),
      })) as Post[];
    },
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as PostComment[];
    },
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ content, imageFile, playerId }: { content: string; imageFile?: File; playerId?: string }) => {
      if (!user) throw new Error('Must be logged in');

      let image_url: string | null = null;
      if (imageFile) {
        const path = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { data, error } = await supabase.from('posts').insert({
        user_id: user.id,
        player_id: playerId || null,
        content,
        image_url,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (!user) throw new Error('Must be logged in');
      if (liked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('post_comments').insert({
        post_id: postId,
        user_id: user.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
