import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface DiscoverPlayer {
  id: string;
  name: string | null;
  position: string | null;
  age_group: string | null;
  age: number | null;
  overall_rating: number | null;
  preferred_foot: string | null;
  team: string | null;
  avatar: string | null;
  location: string | null;
  nationality: string | null;
  bio: string | null;
  strengths: string[] | null;
  achievements: string[] | null;
  available_for_transfer: boolean | null;
  verification_badge: boolean | null;
  is_public: boolean | null;
}

export interface DiscoveryFilters {
  search?: string;
  position?: string;
  minRating?: number;
  transferOnly?: boolean;
  sort?: 'rating' | 'name';
}

/** Browse all public player cards with client-side filtering */
export function useDiscoverPlayers(filters: DiscoveryFilters = {}) {
  return useQuery({
    queryKey: ['discover-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_player_cards')
        .select('*')
        .order('overall_rating', { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as DiscoverPlayer[];
    },
    select: (rows) => {
      let result = rows;
      const q = filters.search?.trim().toLowerCase();
      if (q) {
        result = result.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.team?.toLowerCase().includes(q) ||
            p.location?.toLowerCase().includes(q),
        );
      }
      if (filters.position && filters.position !== 'all') {
        result = result.filter((p) => p.position === filters.position);
      }
      if (filters.minRating) {
        result = result.filter((p) => (p.overall_rating ?? 0) >= filters.minRating!);
      }
      if (filters.transferOnly) {
        result = result.filter((p) => p.available_for_transfer);
      }
      if (filters.sort === 'name') {
        result = [...result].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      }
      return result;
    },
  });
}

/** A single public player profile */
export function useDiscoverPlayer(playerId: string | undefined) {
  return useQuery({
    queryKey: ['discover-player', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_player_cards')
        .select('*')
        .eq('id', playerId!)
        .maybeSingle();
      if (error) throw error;
      return data as DiscoverPlayer | null;
    },
  });
}

/** Follower count for a player */
export function usePlayerFollowers(playerId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['player-followers', playerId, user?.id],
    enabled: !!playerId,
    queryFn: async () => {
      const { count } = await supabase
        .from('player_follows')
        .select('*', { count: 'exact', head: true })
        .eq('player_id', playerId!);
      let isFollowing = false;
      if (user) {
        const { data } = await supabase
          .from('player_follows')
          .select('id')
          .eq('player_id', playerId!)
          .eq('follower_id', user.id)
          .maybeSingle();
        isFollowing = !!data;
      }
      return { count: count ?? 0, isFollowing };
    },
  });
}

export function useToggleFollow(playerId: string | undefined) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (isFollowing: boolean) => {
      if (!user) throw new Error('not-authenticated');
      if (!playerId) throw new Error('no-player');
      if (isFollowing) {
        const { error } = await supabase
          .from('player_follows')
          .delete()
          .eq('player_id', playerId)
          .eq('follower_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('player_follows')
          .insert({ player_id: playerId, follower_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['player-followers', playerId] });
    },
    onError: (e: Error) => {
      if (e.message === 'not-authenticated') {
        toast.error('Sign in to follow players');
      } else {
        toast.error('Could not update follow');
      }
    },
  });
}
