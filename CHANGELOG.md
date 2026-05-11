# CHANGELOG — SCENEIQ FIR Scene Reconstruction Portal

## [0.7.0] — 2026-05-11

### Added
- **Mega Blackletter Hero**: Giant `sceneiq` Pirata One blackletter title (~22vw) with gold gradient fill, 3D float animation (`mega-3d`), and horizontal slice cut — inspired by mohid0x01.vercel.app.
- **Bricolage Grotesque Body Font**: Bold lowercase rounded sans now powers all body copy / headings, paired with Pirata One blackletter for display moments. Playfair Display kept as fallback serif.

### Changed
- Hero `<h1>` switched to lowercase Bricolage extrabold to match portfolio aesthetic while keeping the gold-gradient accent words.
- `--font-display` and `--font-sans` design tokens updated globally — every module inherits the new typography.


## [0.4.0] — 2026-05-09

### Added
- **WebGL-style Twinkling Stars Background**: Fullscreen fixed canvas (`TwinklingStars`) behind every page with gold + cool-blue stars and soft radial vignette. Mounted globally in `__root.tsx`.
- **Real OpenStreetMap Crime Map**: New `CrimeMap` component (Leaflet + react-leaflet, no API key) inside the 3D viewer. Locations are geocoded from FIR text via `@/lib/geocode` covering Khairpur, Sukkur, Karachi, Lahore, Peshawar, Quetta and 11+ Pakistani districts, shown as pulsing gold markers on dark-themed tiles.
- **Provincial Police Shields**: New `PoliceShield` SVG component renders Sindh, Punjab, KPK and Balochistan badges above the "Processes FIR text from" strip on the landing page (crescent + star, province-color gradient, hover tilt).
- **Demo Officer Login**: One-click "Use Demo Officer Account" button on `/login` provisions and signs in `officer@sceneiq.gov.pk / Officer@2026` (auto-confirm enabled).
- **Glass Form Controls**: New `.glass-input` and `.glass-card` utility classes applied across login + dashboard modules.
- **SCENEIQ Emblem**: Official Pakistan Police F.I.R. Reconstruction emblem now used in `SceneIQLogo` (navbar, login, dashboard).

### Changed
- **Darker Base Theme**: Background dropped to near-pure-black (`oklch(0.04 …)`) to maximize twinkling-star contrast.
- **Auth**: Email auto-confirm enabled — sign-up immediately signs the officer in.
- **Leaflet Dark Theme**: Tile inversion + custom popup/attribution/zoom-control styling matching gold-on-black palette.

### Fixed
- Landing page police strip layout now stacks shields above province labels.

## [0.3.0] — 2026-05-08


### Added
- **Job Details Drawer**: Click any job row to open a full-width drawer showing the complete 5-stage pipeline timeline with status nodes, timestamps, metadata (job ID, model, processing time), and error messages for failed jobs.
- **Realtime Toast Notifications**: Sonner toasts fire automatically when any `fir_job` advances pipeline stages, completes, or fails — instant feedback without watching the dashboard.
- **Cancel Pipeline**: Running pipelines can be stopped via a cancel button (updates status to "failed" with "Cancelled by officer" message).
- **Retry Pipeline**: Failed or cancelled jobs can be retried — resets status, clears old scene data, and re-runs the mock pipeline.
- **Glassmorphism Button System**: All buttons across the app (landing, login, dashboard, submit) now use glass-water-effect morphism with backdrop blur, gradient overlays, and glow shadows. Three variants: `glass-button`, `glass-button-primary`, `glass-button-destructive`.
- **Animated Icons on Hover**: All icons across landing page (navbar, hero, features, how-it-works, footer) animate on hover with scale, rotation, and glow effects via `icon-hover`, `icon-glow-hover`, and `icon-float` utility classes.
- **3D Floating Particles**: Hero section now has animated floating gold particles and pulsing radial glow.
- **Staggered Entry Animations**: Hero text, buttons, and labels animate in sequence with motion.div stagger delays.
- **Glass Panel Component Class**: New `glass-panel` utility for frosted glass card effects with backdrop blur.
- **Footer Social Icons**: Added animated GitHub, Mail, and External Link icons with hover rotation effects.
- **Mobile Navbar Menu**: Hamburger menu for mobile navigation with glass panel dropdown.

### Changed
- All landing page sections use framer-motion `whileHover` for interactive icon animations.
- Feature cards use `glass-panel` instead of `card-scene` for consistency.
- Navbar uses glass panel background instead of solid bg.
- About section image container uses glass panel.
- Dashboard table rows now show Details, Cancel, Retry action buttons inline.

### Database
- Added delete policies on `scene_entities` and `scene_events` (officers can delete data for their own jobs, needed for retry).

---

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
