import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Expand,
  Download,
  Share2,
  User,
  Car,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  AlertTriangle,
  FileText,
  Loader,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useSceneStore } from "@/stores/sceneStore";
import { useJobRealtime } from "@/hooks/useJobRealtime";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Scene3DCanvas = lazy(() =>
  import("@/components/viewer/Scene3DCanvas").then((m) => ({ default: m.Scene3DCanvas }))
);
const CrimeMap = lazy(() =>
  import("@/components/CrimeMap").then((m) => ({ default: m.CrimeMap }))
);
import { geocodeFirText } from "@/components/CrimeMap";

const searchSchema = z.object({ jobId: z.string().optional() });

export const Route = createFileRoute("/dashboard/viewer")({
  validateSearch: (search) => searchSchema.parse(search),
  component: SceneViewer,
});

type SceneEntity = Tables<"scene_entities">;
type SceneEvent = Tables<"scene_events">;

function SceneViewer() {
  const { jobId: searchJobId } = Route.useSearch();
  const [resolvedJobId, setResolvedJobId] = useState<string | null>(searchJobId || null);
  const [showSourceText, setShowSourceText] = useState(false);
  const [recentJobs, setRecentJobs] = useState<{ id: string; case_number: string | null; status: string }[]>([]);

  // If no jobId, auto-pick most recent completed job, otherwise list selectable ones
  useEffect(() => {
    if (searchJobId) { setResolvedJobId(searchJobId); return; }
    supabase
      .from("fir_jobs")
      .select("id, status, fir_records(case_number)")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!data) return;
        const list = data.map((d) => ({
          id: d.id,
          status: d.status,
          case_number: (d.fir_records as { case_number?: string } | null)?.case_number || null,
        }));
        setRecentJobs(list);
        const firstCompleted = list.find((j) => j.status === "completed");
        if (firstCompleted) setResolvedJobId(firstCompleted.id);
      });
  }, [searchJobId]);

  const jobId = resolvedJobId;
  const job = useJobRealtime(jobId);
  const [entities, setEntities] = useState<SceneEntity[]>([]);
  const [events, setEvents] = useState<SceneEvent[]>([]);
  const [firText, setFirText] = useState<string>("");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const currentEvent = useSceneStore((s) => s.currentEvent);
  const playing = useSceneStore((s) => s.playing);
  const speed = useSceneStore((s) => s.speed);
  const totalEvents = useSceneStore((s) => s.totalEvents);
  const setCurrentEvent = useSceneStore((s) => s.setCurrentEvent);
  const setPlaying = useSceneStore((s) => s.setPlaying);
  const setSpeed = useSceneStore((s) => s.setSpeed);
  const setTotalEvents = useSceneStore((s) => s.setTotalEvents);
  const nextEvent = useSceneStore((s) => s.nextEvent);
  const prevEvent = useSceneStore((s) => s.prevEvent);

  // Fetch scene data when job completes
  useEffect(() => {
    if (!jobId || job?.status !== "completed") return;
    supabase
      .from("scene_entities")
      .select("*")
      .eq("job_id", jobId)
      .then(({ data }) => { if (data) setEntities(data); });
    supabase
      .from("scene_events")
      .select("*")
      .eq("job_id", jobId)
      .order("sequence_number")
      .then(({ data }) => {
        if (data) {
          setEvents(data);
          setTotalEvents(data.length);
          setCurrentEvent(0);
        }
      });
    // Also fetch FIR text via the job's fir_id
    supabase
      .from("fir_jobs")
      .select("fir_id")
      .eq("id", jobId)
      .single()
      .then(({ data }) => {
        const recId = data?.fir_id;
        if (recId) {
          supabase
            .from("fir_records")
            .select("raw_narrative")
            .eq("id", recId)
            .single()
            .then(({ data: rec }) => { if (rec?.raw_narrative) setFirText(rec.raw_narrative); });
        }
      });
  }, [jobId, job?.status, setTotalEvents, setCurrentEvent]);

  // Auto-play
  useEffect(() => {
    if (!playing || events.length === 0) return;
    const interval = setInterval(() => {
      const store = useSceneStore.getState();
      if (store.currentEvent >= store.totalEvents - 1) {
        setPlaying(false);
      } else {
        nextEvent();
      }
    }, 2000 / speed);
    return () => clearInterval(interval);
  }, [playing, speed, events.length, setPlaying, nextEvent]);

  const actorEntities = entities.filter(e => e.entity_type === "actor");
  const locationEntities = entities.filter(e => e.entity_type === "location");
  const vehicleEntities = entities.filter(e => e.entity_type === "vehicle");

  const roleColor = (role: string | null) => {
    switch (role) {
      case "suspect": return "border-l-red-500";
      case "victim": return "border-l-blue-500";
      case "witness": return "border-l-green-500";
      default: return "border-l-gold";
    }
  };

  const roleBadge = (role: string | null) => {
    switch (role) {
      case "suspect": return "bg-red-500/10 text-red-400";
      case "victim": return "bg-blue-500/10 text-blue-400";
      case "witness": return "bg-green-500/10 text-green-400";
      default: return "bg-gold/10 text-gold";
    }
  };

  const isLoading = !!jobId && (!job || (job.status !== "completed" && job.status !== "failed"));
  const noJob = !jobId;
  const caseNumber = (job as Record<string, unknown>)?.fir_records
    ? ((job as Record<string, unknown>).fir_records as Record<string, string>)?.case_number
    : jobId?.slice(0, 12) || "—";

  const handleDownload = () => {
    if (!jobId) return;
    const payload = {
      case_number: caseNumber,
      job_id: jobId,
      status: job?.status,
      processing_time_ms: job?.processing_time_ms,
      entities,
      events,
      fir_narrative: firText,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${caseNumber || jobId}.sceneiq.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Reconstruction exported");
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/dashboard/viewer?jobId=${jobId || ""}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `SceneIQ ${caseNumber}`, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
      } catch {
        toast.error("Could not share");
      }
    }
  };

  const handleExpand = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => toast.error("Fullscreen blocked"));
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="-m-8 flex h-[calc(100vh-73px)] flex-col bg-background">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
          <span className="font-mono text-sm text-foreground">{String(caseNumber)}</span>
          {isLoading && <Loader className="h-3 w-3 animate-spin text-foreground/70" />}
        </div>
        <span className="text-sm text-muted-foreground">
          {noJob ? "Pick a reconstruction" : job?.status === "completed" ? "Scene Reconstruction" : `Pipeline: ${job?.status || "loading"}`}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={handleDownload} disabled={!jobId || job?.status !== "completed"} title="Download JSON" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"><Download className="h-4 w-4" /></button>
          <button onClick={handleShare} disabled={!jobId} title="Share link" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"><Share2 className="h-4 w-4" /></button>
          <button onClick={handleExpand} title="Fullscreen" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Expand className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        {leftOpen && (
          <div className="w-[280px] shrink-0 overflow-y-auto border-r border-border-subtle bg-[oklch(0.1_0.005_60)] p-4">
            <h3 className="label-uppercase mb-3">Scene Entities</h3>
            <div className="space-y-2">
              {[...actorEntities, ...vehicleEntities].map((e) => (
                <div key={e.id} className={`group cursor-pointer rounded-[4px] border border-border-subtle bg-card p-3 transition-all hover:bg-surface-elevated ${roleColor(e.entity_role)} border-l-[3px]`}>
                  <div className="flex items-center gap-2">
                    {e.entity_type === "vehicle" ? <Car className="h-4 w-4 text-gold" /> : <User className="h-4 w-4 text-text-secondary" />}
                    <span className="text-sm font-medium text-text-primary">{e.label}</span>
                  </div>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${roleBadge(e.entity_role)}`}>
                    {e.entity_role || e.entity_type}
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="h-1 flex-1 rounded-full bg-border-subtle">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${(e.confidence || 0) * 100}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-text-muted">{((e.confidence || 0) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="label-uppercase mb-3 mt-6">Locations</h3>
            <div className="space-y-2">
              {locationEntities.map((l) => (
                <div key={l.id} className="flex items-center gap-2 rounded-[4px] border border-border-subtle bg-card p-3">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span className="text-sm text-text-secondary">{l.label}</span>
                </div>
              ))}
            </div>

            <h3 className="label-uppercase mb-3 mt-6 flex items-center gap-2">
              <MapPin className="h-3 w-3" /> Real-World Map
            </h3>
            <Suspense fallback={<div className="h-[260px] animate-pulse rounded-[6px] bg-surface" />}>
              <CrimeMap
                height="260px"
                 locations={geocodeFirText(firText, locationEntities.map((l) => l.label))}
              />
            </Suspense>
            <p className="mt-2 text-[10px] text-text-muted">
              Locations geocoded from the FIR narrative onto OpenStreetMap.
            </p>
          </div>
        )}

        {/* 3D Canvas */}
        <div className="relative flex-1">
          {noJob ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="w-full max-w-md text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-base font-semibold text-foreground">Pick a reconstruction to view</p>
                <p className="mt-1 text-sm text-muted-foreground">No reconstruction selected. Choose a completed case below or submit a new FIR.</p>
                <div className="mt-6 max-h-[40vh] space-y-1 overflow-y-auto rounded-md border border-border bg-card p-2 text-left">
                  {recentJobs.length === 0 && (
                    <p className="px-3 py-6 text-center text-xs text-muted-foreground">No cases yet.</p>
                  )}
                  {recentJobs.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => setResolvedJobId(j.id)}
                      className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <span className="font-mono text-foreground">{j.case_number || j.id.slice(0, 8)}</span>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{j.status}</span>
                    </button>
                  ))}
                </div>
                <Link to="/dashboard/submit" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Submit new FIR
                </Link>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Loader className="mx-auto h-8 w-8 animate-spin text-foreground/70" />
                <p className="mt-4 text-sm text-muted-foreground">Waiting for pipeline to complete...</p>
                <p className="mt-1 font-mono text-[11px] text-foreground">{job?.status || "connecting"}</p>
                <Link to="/dashboard/processing" search={{ jobId: jobId || "" }} className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-foreground underline">
                  Watch live pipeline
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader className="h-6 w-6 animate-spin text-foreground/70" /></div>}>
                <Scene3DCanvas entities={entities} events={events} />
              </Suspense>

              {events.length > 0 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-md border border-border bg-background/85 px-6 py-3 backdrop-blur-md">
                  <p className="max-w-md text-center text-sm text-foreground">
                    {events[currentEvent]?.description || ""}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right panel */}
        {rightOpen && (
          <div className="w-[240px] shrink-0 overflow-y-auto border-l border-border-subtle bg-[oklch(0.1_0.005_60)] p-4">
            <h3 className="label-uppercase mb-3">Reconstruction Data</h3>

            <div className="space-y-3">
              {actorEntities.map((e) => (
                <div key={e.id}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-text-secondary">{e.label.split(" (")[0]}</span>
                    <span className="font-mono text-gold">{((e.confidence || 0) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-border-subtle">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${(e.confidence || 0) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {entities.some(e => (e.confidence || 0) < 0.8) && (
              <div className="mt-6">
                <h3 className="label-uppercase mb-3 text-amber-500">
                  <AlertTriangle className="mr-1 inline h-3 w-3" />
                  Low Confidence Flags
                </h3>
                {entities.filter(e => (e.confidence || 0) < 0.8).map(e => (
                  <div key={e.id} className="mb-2 rounded-[4px] border border-amber-500/20 bg-amber-500/5 p-3 text-[12px] text-amber-400">
                    {e.label}: {((e.confidence || 0) * 100).toFixed(0)}% — {e.source_text || "inferred"}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowSourceText(true)}
              disabled={!firText}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-foreground/80 transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-3.5 w-3.5" /> Source Text
            </button>

            <div className="mt-6 space-y-2 text-[11px] text-text-muted">
              <div>Model: <span className="font-mono text-text-secondary">{job?.llm_model || "—"}</span></div>
              <div>Processing: <span className="font-mono text-text-secondary">{job?.processing_time_ms ? `${(job.processing_time_ms / 1000).toFixed(1)}s` : "—"}</span></div>
              <div>Entities: <span className="font-mono text-text-secondary">{entities.length}</span></div>
              <div>Events: <span className="font-mono text-text-secondary">{events.length}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom timeline */}
      <div className="border-t border-border-subtle bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[12px] text-gold">
            EVENT {events.length > 0 ? currentEvent + 1 : 0} / {totalEvents}
          </span>

          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentEvent(0)} className="text-text-muted hover:text-gold"><ChevronLeft className="h-4 w-4" /><ChevronLeft className="-ml-3 h-4 w-4" /></button>
            <button onClick={prevEvent} className="text-text-muted hover:text-gold"><ChevronLeft className="h-4 w-4" /></button>
            <button
              onClick={() => setPlaying(!playing)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-background"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={nextEvent} className="text-text-muted hover:text-gold"><ChevronRight className="h-4 w-4" /></button>
            <button onClick={() => setCurrentEvent(totalEvents - 1)} className="text-text-muted hover:text-gold"><ChevronRight className="h-4 w-4" /><ChevronRight className="-ml-3 h-4 w-4" /></button>
          </div>

          {/* Scrubber */}
          <div className="flex-1">
            <div className="relative h-1.5 rounded-full bg-border-subtle">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: totalEvents > 0 ? `${((currentEvent + 1) / totalEvents) * 100}%` : "0%" }} />
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentEvent(i)}
                  className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 transition-all ${
                    i <= currentEvent ? "border-gold bg-gold" : "border-border-accent bg-card"
                  }`}
                  style={{ left: `${((i + 0.5) / totalEvents) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-1">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${speed === s ? "bg-gold text-background" : "text-text-muted hover:text-gold"}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Source Text dialog */}
      {showSourceText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setShowSourceText(false)}>
          <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Source FIR Narrative</p>
                <p className="text-[11px] text-muted-foreground">{String(caseNumber)}</p>
              </div>
              <button onClick={() => setShowSourceText(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <ArrowLeft className="h-4 w-4 rotate-45" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto px-5 py-4">
              <p className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-foreground">
                {firText || "No source text available."}
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-border bg-muted/40 px-5 py-3">
              <button
                onClick={() => { navigator.clipboard.writeText(firText); toast.success("Copied"); }}
                disabled={!firText}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Copy
              </button>
              <button
                onClick={() => setShowSourceText(false)}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
