import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
    location: row.location || '',
    ageGroup: row.age_group || '',
    isPublic: row.is_public ?? false,
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

/** Fetch a single public player by ID — works without authentication */
export function usePublicPlayer(playerId: string | undefined) {
  return useQuery({
    queryKey: ['public-player', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*, development_goals(*), evaluations(*)')
        .eq('id', playerId!)
        .single();
      if (error) throw error;
      return dbToPlayer(data);
    },
  });
}
