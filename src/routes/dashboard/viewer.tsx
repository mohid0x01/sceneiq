import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";

export const Route = createFileRoute("/dashboard/viewer")({
  component: SceneViewer,
});

const entities = [
  { name: "Ahmed (Mulzim)", role: "suspect", color: "border-l-red-500" },
  { name: "Imran (Victim)", role: "victim", color: "border-l-blue-500" },
  { name: "Rizwan (Gawah)", role: "witness", color: "border-l-green-500" },
  { name: "White Suzuki Mehran", role: "vehicle", color: "border-l-gold" },
];

const locations = ["Bazaar Road Crossing", "Atta Flour Mill", "Pir Jo Goth Chowk"];

const events = [
  { id: 1, text: "Mulzim Ahmed arrives at Bazaar Road on foot from the north side at approximately 23:00." },
  { id: 2, text: "Victim Imran is seen walking near Atta Flour Mill carrying a bag." },
  { id: 3, text: "Ahmed confronts Imran near the Bazaar Road crossing." },
  { id: 4, text: "Ahmed strikes Imran with a loha rod. Imran falls to the ground." },
  { id: 5, text: "Witness Rizwan observes the incident from Pir Jo Goth Chowk." },
  { id: 6, text: "Ahmed flees the scene in a white Suzuki Mehran heading south." },
];

function SceneViewer() {
  const [currentEvent, setCurrentEvent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="-m-8 flex h-[calc(100vh-73px)] flex-col bg-[oklch(0.06_0.005_250)]">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between border-b border-border-subtle bg-background px-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-text-muted hover:text-gold"><ArrowLeft className="h-4 w-4" /></Link>
          <span className="font-mono text-sm text-gold">FIR-2024-SHK-00142</span>
        </div>
        <span className="text-sm text-text-secondary">Assault at Bazaar Road, Khairpur</span>
        <div className="flex items-center gap-2">
          <button className="rounded-[4px] p-1.5 text-text-muted hover:bg-surface hover:text-gold"><Download className="h-4 w-4" /></button>
          <button className="rounded-[4px] p-1.5 text-text-muted hover:bg-surface hover:text-gold"><Share2 className="h-4 w-4" /></button>
          <button className="rounded-[4px] p-1.5 text-text-muted hover:bg-surface hover:text-gold"><Expand className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        {leftOpen && (
          <div className="w-[280px] shrink-0 overflow-y-auto border-r border-border-subtle bg-[oklch(0.1_0.005_60)] p-4">
            <h3 className="label-uppercase mb-3">Scene Entities</h3>
            <div className="space-y-2">
              {entities.map((e) => (
                <div key={e.name} className={`group cursor-pointer rounded-[4px] border border-border-subtle bg-card p-3 transition-all hover:bg-surface-elevated ${e.color} border-l-[3px]`}>
                  <div className="flex items-center gap-2">
                    {e.role === "vehicle" ? <Car className="h-4 w-4 text-gold" /> : <User className="h-4 w-4 text-text-secondary" />}
                    <span className="text-sm font-medium text-text-primary">{e.name}</span>
                  </div>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                    e.role === "suspect" ? "bg-red-500/10 text-red-400" :
                    e.role === "victim" ? "bg-blue-500/10 text-blue-400" :
                    e.role === "witness" ? "bg-green-500/10 text-green-400" :
                    "bg-gold/10 text-gold"
                  }`}>
                    {e.role}
                  </span>
                  <button className="mt-2 hidden text-[11px] font-semibold uppercase tracking-[0.1em] text-gold group-hover:block">Focus →</button>
                </div>
              ))}
            </div>

            <h3 className="label-uppercase mb-3 mt-6">Locations</h3>
            <div className="space-y-2">
              {locations.map((l) => (
                <div key={l} className="flex items-center gap-2 rounded-[4px] border border-border-subtle bg-card p-3">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span className="text-sm text-text-secondary">{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3D Canvas placeholder */}
        <div className="relative flex-1">
          {/* Dark scene with grid */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: "linear-gradient(oklch(0.72 0.12 85 / 6%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.12 85 / 6%) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />
            {/* Simulated entities */}
            <div className="absolute left-[30%] top-[40%] flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]" />
              <span className="mt-1 text-[10px] text-red-400">Ahmed</span>
            </div>
            <div className="absolute left-[50%] top-[45%] flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
              <span className="mt-1 text-[10px] text-blue-400">Imran</span>
            </div>
            <div className="absolute left-[70%] top-[55%] flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
              <span className="mt-1 text-[10px] text-green-400">Rizwan</span>
            </div>
            {/* Gold dotted paths */}
            <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: "none" }}>
              <line x1="30%" y1="20%" x2="30%" y2="40%" stroke="oklch(0.72 0.12 85 / 40%)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30%" y1="45%" x2="50%" y2="45%" stroke="oklch(0.72 0.12 85 / 30%)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            {/* Location beacons */}
            {[["35%", "65%"], ["55%", "30%"], ["72%", "70%"]].map(([left, top], i) => (
              <div key={i} className="absolute" style={{ left, top }}>
                <div className="h-4 w-4 rounded-full border border-gold/50 bg-gold/10 gold-pulse" />
              </div>
            ))}
          </div>

          {/* Current event overlay */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-[4px] border border-gold/20 bg-background/80 px-6 py-3 backdrop-blur-md">
            <p className="max-w-md text-center text-sm text-text-primary">
              {events[currentEvent].text}
            </p>
          </div>
        </div>

        {/* Right panel */}
        {rightOpen && (
          <div className="w-[240px] shrink-0 overflow-y-auto border-l border-border-subtle bg-[oklch(0.1_0.005_60)] p-4">
            <h3 className="label-uppercase mb-3">Reconstruction Data</h3>

            <div className="space-y-3">
              {entities.map((e) => (
                <div key={e.name}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-text-secondary">{e.name.split(" (")[0]}</span>
                    <span className="font-mono text-gold">94%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-border-subtle">
                    <div className="h-full rounded-full bg-gold" style={{ width: "94%" }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="label-uppercase mb-3 text-amber-500">
                <AlertTriangle className="mr-1 inline h-3 w-3" />
                Low Confidence Flags
              </h3>
              <div className="rounded-[4px] border border-amber-500/20 bg-amber-500/5 p-3 text-[12px] text-amber-400">
                Vehicle registration not found in text — inferred from context
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] border border-border-accent py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-text-secondary transition-colors hover:border-gold hover:text-gold">
              <FileText className="h-3.5 w-3.5" /> Source Text
            </button>

            <div className="mt-6 space-y-2 text-[11px] text-text-muted">
              <div>Model: <span className="font-mono text-text-secondary">Llama-3.1-70B</span></div>
              <div>Processing: <span className="font-mono text-text-secondary">24.3s</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom timeline */}
      <div className="border-t border-border-subtle bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[12px] text-gold">EVENT {currentEvent + 1} / {events.length}</span>

          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentEvent(0)} className="text-text-muted hover:text-gold"><ChevronLeft className="h-4 w-4" /><ChevronLeft className="-ml-3 h-4 w-4" /></button>
            <button onClick={() => setCurrentEvent(Math.max(0, currentEvent - 1))} className="text-text-muted hover:text-gold"><ChevronLeft className="h-4 w-4" /></button>
            <button
              onClick={() => setPlaying(!playing)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-background"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={() => setCurrentEvent(Math.min(events.length - 1, currentEvent + 1))} className="text-text-muted hover:text-gold"><ChevronRight className="h-4 w-4" /></button>
            <button onClick={() => setCurrentEvent(events.length - 1)} className="text-text-muted hover:text-gold"><ChevronRight className="h-4 w-4" /><ChevronRight className="-ml-3 h-4 w-4" /></button>
          </div>

          {/* Scrubber */}
          <div className="flex-1">
            <div className="relative h-1.5 rounded-full bg-border-subtle">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${((currentEvent + 1) / events.length) * 100}%` }} />
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentEvent(i)}
                  className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 transition-all ${
                    i <= currentEvent ? "border-gold bg-gold" : "border-border-accent bg-card"
                  }`}
                  style={{ left: `${((i + 0.5) / events.length) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-1">
            {["0.5x", "1x", "2x"].map((speed) => (
              <button
                key={speed}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${speed === "1x" ? "bg-gold text-background" : "text-text-muted hover:text-gold"}`}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[12px] text-text-muted">{events[currentEvent].text}</p>
      </div>
    </div>
  );
}
