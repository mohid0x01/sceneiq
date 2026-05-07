# CHANGELOG — SCENEIQ FIR Scene Reconstruction Portal

## [0.2.0] — 2026-05-07

### Added
- **Authentication**: Real Supabase auth with email/password sign-up and sign-in on the login page. Officer profiles auto-created via database trigger.
- **Submit FIR → Database**: The Submit FIR form now creates `fir_records` and `fir_jobs` rows in the database, then navigates to the processing page with a real job ID.
- **5-Stage Mock AI Pipeline**: Server function (`runMockPipeline`) that simulates all 5 pipeline stages (preprocessing → entity extraction → spatial resolution → timeline sequencing → scene generation), updating `fir_jobs.status` and `pipeline_progress` in real time, then inserts realistic mock `scene_entities` and `scene_events` into the database.
- **Realtime Subscriptions**: Dashboard and viewer pages subscribe to Postgres changes on `fir_jobs` via Supabase Realtime. Status badges update live as the pipeline progresses through stages.
- **Dashboard — Live Data**: Stats (total FIRs, completed, processing, success rate) and recent cases table now read from the database with realtime updates. Status badges show "Stage 1/5" through "Stage 5/5" for active pipelines.
- **Processing Page — Realtime**: Reads `jobId` from search params, subscribes to realtime job updates, and shows live stage progression. Auto-redirects to 3D viewer on completion.
- **3D Viewer — Database-Driven**: Scene3DCanvas now accepts `entities` and `events` props from the database instead of hardcoded data. Entity positions animate based on event destinations. Movement trails render from real event coordinates.
- **Viewer Timeline Controls**: Play/pause, speed (0.5x/1x/2x), scrubber, and event navigation all connected to the Zustand scene store and drive the R3F canvas.
- **Viewer — Realtime Job Status**: Shows loading spinner with live pipeline status while waiting for completion, then loads 3D scene data.
- **CHANGELOG**: Added this file.

### Changed
- **Scene3DCanvas**: Refactored from hardcoded entity data to accept database entity/event props. Positions computed dynamically from scene_events per entity.
- **Viewer Page**: Complete rewrite — lazy-loads R3F canvas, fetches entities/events from Supabase, wires up Zustand store for timeline controls.
- **Dashboard Index**: Switched from static mock data to live database queries with realtime subscriptions.
- **Processing Page**: Now reads jobId from URL search params and subscribes to realtime status updates instead of using a timer.

### Database
- Tables: `officer_profiles`, `fir_records`, `fir_jobs` (realtime enabled), `scene_entities`, `scene_events`
- Enums: `incident_type`, `job_status`, `entity_role`, `entity_type`
- RLS policies on all tables scoped to authenticated officer
- Auto-profile creation trigger on auth.users insert

---

## [0.1.0] — 2026-05-07

### Added
- Initial SCENEIQ portal with ultra-dark luxury design system
- Landing page with hero, features, how-it-works, about, and footer sections
- Login page (UI only)
- Dashboard layout with sidebar navigation
- Dashboard home with static stats and recent cases table
- Submit FIR form (UI only)
- Processing page with animated stage indicators
- 3D Scene Viewer with hardcoded entities, locations, movement trails, and timeline scrubber
- Scene3DCanvas using React Three Fiber with OrbitControls, Grid, entity capsules, location beacons
- Zustand scene store for timeline state management
- Design tokens: gold accent (#C9A84C), near-black backgrounds, Playfair Display + Inter + JetBrains Mono typography
