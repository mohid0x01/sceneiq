import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SceneIQLogo } from "@/components/SceneIQLogo";
import {
  LayoutDashboard,
  FilePlus,
  Boxes,
  Archive,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  Loader as LoaderIcon,
  AlertCircle,
  X,
} from "lucide-react";
import { useJobsRealtime } from "@/hooks/useJobRealtime";

const navItems = [
  { label: "Dashboard Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Submit New FIR", icon: FilePlus, href: "/dashboard/submit" },
  { label: "My Reconstructions", icon: Boxes, href: "/dashboard/viewer" },
  { label: "Case Archive", icon: Archive, href: "/dashboard/archive" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-6">
        <Link to="/dashboard">
          <SceneIQLogo />
        </Link>
      </div>

      <nav className="mt-2 flex-1 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-sidebar-foreground/60 transition-colors hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

const statusIcon = (s: string) => {
  if (s === "completed") return <CheckCircle2 className="h-4 w-4 text-foreground" />;
  if (s === "failed") return <AlertCircle className="h-4 w-4 text-destructive" />;
  return <LoaderIcon className="h-4 w-4 animate-spin text-foreground/70" />;
};

const statusLabel = (s: string): string => {
  const map: Record<string, string> = {
    pending: "Pending",
    preprocessing: "Stage 1/5 — Preprocessing",
    entity_extraction: "Stage 2/5 — Entity Extraction",
    spatial_resolution: "Stage 3/5 — Spatial Resolution",
    timeline_sequencing: "Stage 4/5 — Timeline Sequencing",
    scene_generation: "Stage 5/5 — Scene Generation",
    completed: "Reconstruction Complete",
    failed: "Pipeline Failed",
  };
  return map[s] || s;
};

export function DashboardHeader() {
  const { theme, toggle } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const jobs = useJobsRealtime();
  const recent = jobs.slice(0, 12);
  const activeCount = jobs.filter((j) => !["completed", "failed"].includes(j.status)).length;

  return (
    <header className="relative flex items-center justify-between border-b border-border bg-background px-8 py-5">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          SceneIQ Console
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered FIR scene reconstruction · {" "}
          <span className="font-mono text-foreground/80">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="rounded-md border border-border p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative rounded-md border border-border p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification popup */}
      {notifOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setNotifOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-8 top-[72px] z-50 w-[380px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Notifications</p>
                <p className="text-[11px] text-muted-foreground">
                  {activeCount > 0 ? `${activeCount} active pipeline${activeCount > 1 ? "s" : ""}` : "All caught up"}
                </p>
              </div>
              <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {recent.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No activity yet.
                </div>
              ) : (
                recent.map((job) => (
                  <Link
                    key={job.id}
                    to={job.status === "completed" ? "/dashboard/viewer" : "/dashboard/processing"}
                    search={{ jobId: job.id }}
                    onClick={() => setNotifOpen(false)}
                    className="flex items-start gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted"
                  >
                    <div className="mt-0.5">{statusIcon(job.status)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {job.fir_records?.case_number || job.id.slice(0, 8)}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {statusLabel(job.status)}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {new Date(job.created_at).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
