import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CrimeLocation } from "@/lib/geocode";

export { geocodeFirText, type CrimeLocation } from "@/lib/geocode";

// Fix Leaflet's default icon paths in bundlers
const goldIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:28px;height:28px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle, rgba(201,168,76,0.9) 0%, rgba(201,168,76,0.2) 60%, transparent 70%);animation:crime-pulse 2s ease-in-out infinite;"></div>
      <div style="position:absolute;inset:8px;border-radius:50%;background:#c9a84c;border:2px solid #fff8e0;box-shadow:0 0 12px rgba(201,168,76,0.9);"></div>
    </div>
    <style>@keyframes crime-pulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.6);opacity:.3}}</style>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// CrimeLocation type re-exported from @/lib/geocode at top of file


interface CrimeMapProps {
  locations: CrimeLocation[];
  height?: string;
}

/**
 * Real OpenStreetMap (no API key required) showing crime scene locations
 * geocoded from the FIR text. Defaults to Sindh / Khairpur area when no
 * locations are provided.
 */
export function CrimeMap({ locations, height = "320px" }: CrimeMapProps) {
  // Default center: Khairpur, Sindh
  const valid = locations.filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng));
  const center: [number, number] = valid.length > 0
    ? [valid[0].lat, valid[0].lng]
    : [27.5295, 68.7592];

  useEffect(() => {
    // Force leaflet to recalc size on mount (fixes gray tiles in panels)
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="overflow-hidden rounded-[6px] border border-gold/30"
      style={{ height, background: "#0a0a0a" }}
    >
      <MapContainer
        center={center}
        zoom={valid.length > 0 ? 13 : 9}
        style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        {valid.map((loc, i) => (
          <div key={i}>
            <Circle
              center={[loc.lat, loc.lng]}
              radius={120}
              pathOptions={{ color: "#c9a84c", fillColor: "#c9a84c", fillOpacity: 0.15, weight: 1 }}
            />
            <Marker position={[loc.lat, loc.lng]} icon={goldIcon}>
              <Popup>
                <div style={{ fontFamily: "Inter, sans-serif", color: "#111" }}>
                  <strong>{loc.label}</strong>
                  {loc.description && <div style={{ fontSize: 11, marginTop: 4 }}>{loc.description}</div>}
                  <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}

/**
 * Simple geocoder mapping common Sindh / Pakistani place keywords to
 * approximate coordinates. Avoids needing an external API key.
 * For unknown places, returns null.
 */
const PLACE_DB: Record<string, [number, number]> = {
  khairpur: [27.5295, 68.7592],
  sukkur: [27.7136, 68.8486],
  karachi: [24.8607, 67.0011],
  hyderabad: [25.396, 68.3578],
  larkana: [27.5571, 68.2126],
  shikarpur: [27.9556, 68.6383],
  nawabshah: [26.2442, 68.41],
  thatta: [24.7461, 67.9243],
  badin: [24.6555, 68.8378],
  mirpurkhas: [25.5276, 69.0142],
  lahore: [31.5204, 74.3587],
  islamabad: [33.6844, 73.0479],
  rawalpindi: [33.5651, 73.0169],
  peshawar: [34.0151, 71.5249],
  quetta: [30.1798, 66.9750],
  multan: [30.1575, 71.5249],
  faisalabad: [31.4187, 73.0791],
};

export function geocodeFirText(text: string, fallbackLabels: string[] = []): CrimeLocation[] {
  const found: CrimeLocation[] = [];
  const seen = new Set<string>();
  const blob = (text + " " + fallbackLabels.join(" ")).toLowerCase();
  for (const [name, coords] of Object.entries(PLACE_DB)) {
    if (blob.includes(name) && !seen.has(name)) {
      seen.add(name);
      found.push({
        label: name.charAt(0).toUpperCase() + name.slice(1),
        lat: coords[0] + (Math.random() - 0.5) * 0.01,
        lng: coords[1] + (Math.random() - 0.5) * 0.01,
        description: "Location referenced in FIR",
      });
    }
  }
  // Also add any explicit location-entity labels with rough offsets near first hit
  if (found.length > 0) {
    fallbackLabels.forEach((lbl, i) => {
      if (!found.some((f) => f.label.toLowerCase() === lbl.toLowerCase())) {
        found.push({
          label: lbl,
          lat: found[0].lat + (i + 1) * 0.003,
          lng: found[0].lng + (i + 1) * 0.003,
          description: "Scene entity",
        });
      }
    });
  }
  return found;
}
