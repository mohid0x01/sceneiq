CREATE POLICY "Officers can delete entities via job"
ON public.scene_entities
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM fir_jobs
  WHERE fir_jobs.id = scene_entities.job_id
  AND fir_jobs.officer_id = auth.uid()
));

CREATE POLICY "Officers can delete events via job"
ON public.scene_events
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM fir_jobs
  WHERE fir_jobs.id = scene_events.job_id
  AND fir_jobs.officer_id = auth.uid()
));