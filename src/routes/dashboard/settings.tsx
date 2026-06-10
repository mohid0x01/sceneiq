import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

type Tab = "ai" | "providers" | "developer" | "system";

type Settings = {
  defaultModel: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enableStreaming: boolean;
  enableAutoRetry: boolean;
  providers: {
    lovable: { enabled: boolean; key: string };
    openai: { enabled: boolean; key: string };
    gemini: { enabled: boolean; key: string };
    anthropic: { enabled: boolean; key: string };
  };
  developer: {
    debugMode: boolean;
    verboseLogs: boolean;
    webhookUrl: string;
    rateLimitPerMin: number;
    apiBaseUrl: string;
  };
  system: {
    orgName: string;
    supportEmail: string;
    timezone: string;
    retentionDays: number;
    enableTelemetry: boolean;
    enableNewSignups: boolean;
    maintenanceMode: boolean;
  };
};

const MODELS = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (Preview)", group: "Lovable AI · Recommended" },
  { id: "google/gemini-3.5-flash", label: "Gemini 3.5 Flash", group: "Lovable AI" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", group: "Lovable AI" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", group: "Lovable AI" },
  { id: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", group: "Lovable AI" },
  { id: "openai/gpt-5", label: "GPT-5", group: "OpenAI" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", group: "OpenAI" },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", group: "OpenAI" },
  { id: "openai/gpt-5.4", label: "GPT-5.4", group: "OpenAI" },
  { id: "openai/gpt-5.5", label: "GPT-5.5", group: "OpenAI" },
];

const DEFAULTS: Settings = {
  defaultModel: "google/gemini-3-flash-preview",
  fallbackModel: "google/gemini-2.5-flash",
  temperature: 0.4,
  maxTokens: 4096,
  systemPrompt:
    "You are an expert forensic reconstruction assistant for Pakistani law enforcement. Extract entities, events, and timeline from FIR text. Always cite passages.",
  enableStreaming: true,
  enableAutoRetry: true,
  providers: {
    lovable: { enabled: true, key: "•••• managed by Lovable Cloud" },
    openai: { enabled: false, key: "" },
    gemini: { enabled: false, key: "" },
    anthropic: { enabled: false, key: "" },
  },
  developer: {
    debugMode: false,
    verboseLogs: false,
    webhookUrl: "",
    rateLimitPerMin: 60,
    apiBaseUrl: "https://ai.gateway.lovable.dev/v1",
  },
  system: {
    orgName: "Sindh Police · Forensic Reconstruction",
    supportEmail: "ops@fir-reconstruct.gov.pk",
    timezone: "Asia/Karachi",
    retentionDays: 365,
    enableTelemetry: true,
    enableNewSignups: false,
    maintenanceMode: false,
  },
};

const STORAGE_KEY = "fir.admin.settings.v1";

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("ai");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setDirty(true);
  };

  const updateProvider = (
    p: keyof Settings["providers"],
    patch: Partial<Settings["providers"][keyof Settings["providers"]]>
  ) => {
    setSettings((s) => ({ ...s, providers: { ...s.providers, [p]: { ...s.providers[p], ...patch } } }));
    setDirty(true);
  };

  const updateDev = <K extends keyof Settings["developer"]>(k: K, v: Settings["developer"][K]) => {
    setSettings((s) => ({ ...s, developer: { ...s.developer, [k]: v } }));
    setDirty(true);
  };

  const updateSys = <K extends keyof Settings["system"]>(k: K, v: Settings["system"][K]) => {
    setSettings((s) => ({ ...s, system: { ...s.system, [k]: v } }));
    setDirty(true);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setDirty(false);
    toast.success("Settings saved", { description: "Configuration persisted locally." });
  };

  const reset = () => {
    setSettings(DEFAULTS);
    setDirty(true);
    toast.message("Reverted to defaults", { description: "Click Save to apply." });
  };

  const groupedModels = useMemo(() => {
    const m = new Map<string, typeof MODELS>();
    MODELS.forEach((mod) => {
      const arr = m.get(mod.group) ?? [];
      arr.push(mod);
      m.set(mod.group, arr);
    });
    return Array.from(m.entries());
  }, []);

  return (
    <div className="pb-20">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">
            Admin Console
          </h1>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            AI models, provider keys, developer controls and platform settings for this SaaS deployment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="glass-button rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted hover:text-text-primary"
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={!dirty}
            className="glass-button rounded-md bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground disabled:opacity-40"
          >
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border-subtle">
        {([
          ["ai", "AI Models"],
          ["providers", "Provider Keys"],
          ["developer", "Developer"],
          ["system", "System"],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
              tab === id ? "text-text-primary" : "text-text-muted hover:text-text-primary"
            }`}
          >
            {label}
            {tab === id && (
              <span className="absolute inset-x-2 -bottom-px h-px bg-primary shadow-[0_0_12px_var(--color-primary)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-8 grid gap-6">
        {tab === "ai" && (
          <section className="glass-panel rounded-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-primary">
              Model configuration
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Default model used for reconstruction. Fallback runs if primary errors or hits rate limit.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Default model">
                <select
                  value={settings.defaultModel}
                  onChange={(e) => update("defaultModel", e.target.value)}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                >
                  {groupedModels.map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field label="Fallback model">
                <select
                  value={settings.fallbackModel}
                  onChange={(e) => update("fallbackModel", e.target.value)}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                >
                  {groupedModels.map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field label={`Temperature · ${settings.temperature.toFixed(2)}`}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.temperature}
                  onChange={(e) => update("temperature", parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </Field>
              <Field label="Max tokens">
                <input
                  type="number"
                  min={256}
                  max={32000}
                  value={settings.maxTokens}
                  onChange={(e) => update("maxTokens", parseInt(e.target.value || "0", 10))}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="System prompt">
                  <textarea
                    value={settings.systemPrompt}
                    onChange={(e) => update("systemPrompt", e.target.value)}
                    rows={5}
                    className="glass-input w-full rounded-md px-3 py-2.5 font-mono text-xs leading-relaxed"
                  />
                </Field>
              </div>
              <Toggle
                label="Streaming responses"
                description="Stream tokens to UI as they arrive."
                checked={settings.enableStreaming}
                onChange={(v) => update("enableStreaming", v)}
              />
              <Toggle
                label="Auto-retry on failure"
                description="Retry once with fallback model on 429/5xx."
                checked={settings.enableAutoRetry}
                onChange={(v) => update("enableAutoRetry", v)}
              />
            </div>
          </section>
        )}

        {tab === "providers" && (
          <section className="glass-panel rounded-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-primary">
              Provider keys
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Bring-your-own keys are stored locally for now. For production, move them to Lovable Cloud secrets.
            </p>
            <div className="mt-6 space-y-4">
              <ProviderRow
                name="Lovable AI Gateway"
                badge="Managed"
                enabled={settings.providers.lovable.enabled}
                keyValue={settings.providers.lovable.key}
                onToggle={(v) => updateProvider("lovable", { enabled: v })}
                onKeyChange={() => {}}
                readonly
              />
              <ProviderRow
                name="OpenAI"
                enabled={settings.providers.openai.enabled}
                keyValue={settings.providers.openai.key}
                onToggle={(v) => updateProvider("openai", { enabled: v })}
                onKeyChange={(v) => updateProvider("openai", { key: v })}
                placeholder="sk-..."
              />
              <ProviderRow
                name="Google Gemini"
                enabled={settings.providers.gemini.enabled}
                keyValue={settings.providers.gemini.key}
                onToggle={(v) => updateProvider("gemini", { enabled: v })}
                onKeyChange={(v) => updateProvider("gemini", { key: v })}
                placeholder="AIza..."
              />
              <ProviderRow
                name="Anthropic Claude"
                enabled={settings.providers.anthropic.enabled}
                keyValue={settings.providers.anthropic.key}
                onToggle={(v) => updateProvider("anthropic", { enabled: v })}
                onKeyChange={(v) => updateProvider("anthropic", { key: v })}
                placeholder="sk-ant-..."
              />
            </div>
          </section>
        )}

        {tab === "developer" && (
          <section className="glass-panel rounded-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-primary">
              Developer settings
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Internal tooling for SaaS operators. Changes here affect every tenant on this deployment.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="API base URL">
                <input
                  value={settings.developer.apiBaseUrl}
                  onChange={(e) => updateDev("apiBaseUrl", e.target.value)}
                  className="glass-input w-full rounded-md px-3 py-2.5 font-mono text-xs"
                />
              </Field>
              <Field label="Rate limit (req/min)">
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={settings.developer.rateLimitPerMin}
                  onChange={(e) => updateDev("rateLimitPerMin", parseInt(e.target.value || "0", 10))}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Webhook URL (events: case.created, reconstruction.complete)">
                  <input
                    value={settings.developer.webhookUrl}
                    onChange={(e) => updateDev("webhookUrl", e.target.value)}
                    placeholder="https://your-app.example.com/hooks/fir"
                    className="glass-input w-full rounded-md px-3 py-2.5 font-mono text-xs"
                  />
                </Field>
              </div>
              <Toggle
                label="Debug mode"
                description="Surface full error stacks in UI."
                checked={settings.developer.debugMode}
                onChange={(v) => updateDev("debugMode", v)}
              />
              <Toggle
                label="Verbose logs"
                description="Log every model call payload."
                checked={settings.developer.verboseLogs}
                onChange={(v) => updateDev("verboseLogs", v)}
              />
            </div>

            <div className="mt-8 rounded-md border border-border-subtle bg-background/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                Deployment
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <Info k="Runtime" v="Cloudflare Workers · TanStack Start" />
                <Info k="Region" v="auto · edge" />
                <Info k="Database" v="Lovable Cloud (Postgres)" />
                <Info k="AI Gateway" v="ai.gateway.lovable.dev/v1" />
              </dl>
            </div>
          </section>
        )}

        {tab === "system" && (
          <section className="glass-panel rounded-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-primary">
              System
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Organization name">
                <input
                  value={settings.system.orgName}
                  onChange={(e) => updateSys("orgName", e.target.value)}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                />
              </Field>
              <Field label="Support email">
                <input
                  type="email"
                  value={settings.system.supportEmail}
                  onChange={(e) => updateSys("supportEmail", e.target.value)}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                />
              </Field>
              <Field label="Timezone">
                <select
                  value={settings.system.timezone}
                  onChange={(e) => updateSys("timezone", e.target.value)}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                >
                  {["Asia/Karachi", "Asia/Dubai", "UTC", "Europe/London", "America/New_York"].map((tz) => (
                    <option key={tz}>{tz}</option>
                  ))}
                </select>
              </Field>
              <Field label="Case retention (days)">
                <input
                  type="number"
                  min={30}
                  max={3650}
                  value={settings.system.retentionDays}
                  onChange={(e) => updateSys("retentionDays", parseInt(e.target.value || "0", 10))}
                  className="glass-input w-full rounded-md px-3 py-2.5 text-sm"
                />
              </Field>
              <Toggle
                label="Anonymous telemetry"
                description="Send usage metrics to improve the platform."
                checked={settings.system.enableTelemetry}
                onChange={(v) => updateSys("enableTelemetry", v)}
              />
              <Toggle
                label="Allow new sign-ups"
                description="Officers can self-register accounts."
                checked={settings.system.enableNewSignups}
                onChange={(v) => updateSys("enableNewSignups", v)}
              />
              <div className="md:col-span-2">
                <Toggle
                  label="Maintenance mode"
                  description="Disable submissions and show banner to all users."
                  checked={settings.system.maintenanceMode}
                  onChange={(v) => updateSys("maintenanceMode", v)}
                  danger
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  danger,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-start justify-between gap-4 rounded-md border p-4 text-left transition-all ${
        checked
          ? danger
            ? "border-red-500/40 bg-red-500/5"
            : "border-primary/40 bg-primary/5"
          : "border-border-subtle bg-background/30 hover:border-border-accent"
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
      </div>
      <span
        className={`mt-1 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? (danger ? "bg-red-500" : "bg-primary") : "bg-border-subtle"
        }`}
      >
        <span
          className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function ProviderRow({
  name,
  badge,
  enabled,
  keyValue,
  onToggle,
  onKeyChange,
  placeholder,
  readonly,
}: {
  name: string;
  badge?: string;
  enabled: boolean;
  keyValue: string;
  onToggle: (v: boolean) => void;
  onKeyChange: (v: string) => void;
  placeholder?: string;
  readonly?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-md border border-border-subtle bg-background/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${
              enabled ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-border-accent"
            }`}
          />
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          {badge && (
            <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {badge}
            </span>
          )}
        </div>
        <Toggle label="" checked={enabled} onChange={onToggle} />
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type={show ? "text" : "password"}
          value={keyValue}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readonly}
          className="glass-input flex-1 rounded-md px-3 py-2 font-mono text-xs disabled:opacity-60"
          disabled={!enabled}
        />
        {!readonly && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="glass-button rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{k}</dt>
      <dd className="mt-0.5 font-mono text-xs text-text-primary">{v}</dd>
    </div>
  );
}
