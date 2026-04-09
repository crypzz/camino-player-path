import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// ── Announcements ──
export function useAnnouncements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*, announcement_reads(user_id)')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((a: any) => ({
        ...a,
        isRead: a.announcement_reads?.some((r: any) => r.user_id === user?.id) ?? false,
      }));
    },
    enabled: !!user,
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (values: { title: string; content: string; target_type: string; target_team_id?: string; pinned?: boolean }) => {
      const { error } = await supabase.from('announcements').insert({
        ...values,
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

export function useMarkAnnouncementRead() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase.from('announcement_reads').insert({
        announcement_id: announcementId,
        user_id: user!.id,
      });
      if (error && !error.message.includes('duplicate')) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  });
}

// ── Conversations & Messages ──
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, conversation_participants(user_id, role)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (values: { type: string; title?: string; team_id?: string; participant_ids: string[] }) => {
      const { participant_ids, ...rest } = values;
      const { data, error } = await supabase.from('conversations').insert({
        ...rest,
        created_by: user!.id,
      }).select().single();
      if (error) throw error;

      // Add participants including self
      const allIds = [...new Set([user!.id, ...participant_ids])];
      const { error: pErr } = await supabase.from('conversation_participants').insert(
        allIds.map(uid => ({
          conversation_id: data.id,
          user_id: uid,
          role: uid === user!.id ? 'admin' : 'member',
        }))
      );
      if (pErr) throw pErr;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (values: { conversation_id: string; content: string }) => {
      const { error } = await supabase.from('messages').insert({
        ...values,
        sender_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.conversation_id] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// ── Player Feedback ──
export function usePlayerFeedback(playerId?: string) {
  return useQuery({
    queryKey: ['player_feedback', playerId],
    queryFn: async () => {
      let q = supabase.from('player_feedback').select('*').order('created_at', { ascending: false });
      if (playerId) q = q.eq('player_id', playerId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!playerId,
  });
}

export function useCreateFeedback() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (values: { player_id: string; strengths: string; improvements: string; notes: string }) => {
      const { error } = await supabase.from('player_feedback').insert({
        ...values,
        coach_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['player_feedback', vars.player_id] }),
  });
}

// ── Notifications ──
export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', user!.id).eq('read', false);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ── Profiles helper ──
export function useAllProfiles() {
  return useQuery({
    queryKey: ['all_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data ?? [];
    },
  });
}
