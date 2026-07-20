
CREATE POLICY "Analytics clips read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'analytics-clips' AND (
      public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director')
      OR auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS(SELECT 1 FROM public.analytics_highlight_clips c
                JOIN public.players p ON p.id = c.player_id
                WHERE c.storage_path = name AND p.created_by = auth.uid())
    )
  );
CREATE POLICY "Analytics clips write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'analytics-clips' AND (
      public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director')
      OR auth.uid()::text = (storage.foldername(name))[1]
    )
  );
CREATE POLICY "Analytics clips delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'analytics-clips' AND (
      public.has_role(auth.uid(),'director')
      OR auth.uid()::text = (storage.foldername(name))[1]
    )
  );
