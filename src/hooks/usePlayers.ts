import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Player, TechnicalMetrics, TacticalMetrics, PhysicalMetrics, MentalMetrics } from '@/types/player';
import { Json } from '@/integrations/supabase/types';

function jsonToMetrics<T>(json: Json): T {
  return (json as unknown) as T;
}

function dbToPlayer(row: any): Player {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    position: row.position,
    team: row.team,
    avatar: row.avatar || '',
    joinDate: row.join_date,
    nationality: row.nationality || '',
    preferredFoot: row.preferred_foot as 'Left' | 'Right' | 'Both',
    height: row.height || 170,
    weight: row.weight || 65,
    location: (row as any).location || '',
    ageGroup: (row as any).age_group || '',
    isPublic: (row as any).is_public ?? false,
    technical: jsonToMetrics<TechnicalMetrics>(row.technical),
    tactical: jsonToMetrics<TacticalMetrics>(row.tactical),
    physical: jsonToMetrics<PhysicalMetrics>(row.physical),
    mental: jsonToMetrics<MentalMetrics>(row.mental),
    attendance: row.attendance || 0,
    overallRating: Number(row.overall_rating) || 0,
    goals: row.development_goals?.map((g: any) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      status: g.status,
      dueDate: g.due_date,
      category: g.category,
    })) || [],
    cpiHistory: row.evaluations?.map((e: any) => ({
      date: e.date,
      score: Number(e.score),
      technical: Number(e.technical),
      tactical: Number(e.tactical),
      physical: Number(e.physical),
      mental: Number(e.mental),
    })) || [],
    videos: [],
    reports: [],
  };
}

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*, development_goals(*), evaluations(*)')
        .order('name');
      if (error) throw error;
      return (data || []).map(dbToPlayer);
    },
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (player: Omit<Player, 'id' | 'goals' | 'cpiHistory' | 'videos' | 'reports'>) => {
      const { data, error } = await supabase.from('players').insert({
        created_by: user!.id,
        name: player.name,
        age: player.age,
        position: player.position,
        team: player.team,
        avatar: player.avatar,
        join_date: player.joinDate,
        nationality: player.nationality,
        preferred_foot: player.preferredFoot,
        height: player.height,
        weight: player.weight,
        technical: player.technical as unknown as Json,
        tactical: player.tactical as unknown as Json,
        physical: player.physical as unknown as Json,
        mental: player.mental as unknown as Json,
        attendance: player.attendance,
        overall_rating: player.overallRating,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Player, 'id' | 'goals' | 'cpiHistory' | 'videos' | 'reports'>>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.age !== undefined) dbUpdates.age = updates.age;
      if (updates.position !== undefined) dbUpdates.position = updates.position;
      if (updates.team !== undefined) dbUpdates.team = updates.team;
      if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
      if (updates.joinDate !== undefined) dbUpdates.join_date = updates.joinDate;
      if (updates.nationality !== undefined) dbUpdates.nationality = updates.nationality;
      if (updates.preferredFoot !== undefined) dbUpdates.preferred_foot = updates.preferredFoot;
      if (updates.height !== undefined) dbUpdates.height = updates.height;
      if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
      if (updates.technical !== undefined) dbUpdates.technical = updates.technical as unknown as Json;
      if (updates.tactical !== undefined) dbUpdates.tactical = updates.tactical as unknown as Json;
      if (updates.physical !== undefined) dbUpdates.physical = updates.physical as unknown as Json;
      if (updates.mental !== undefined) dbUpdates.mental = updates.mental as unknown as Json;
      if (updates.attendance !== undefined) dbUpdates.attendance = updates.attendance;
      if (updates.overallRating !== undefined) dbUpdates.overall_rating = updates.overallRating;

      const { data, error } = await supabase
        .from('players')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
}
