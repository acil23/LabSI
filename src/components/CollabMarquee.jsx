import React, { useMemo } from "react";
import { asAbsolute } from "../lib/http";

/**
 * Infinite logo marquee with CSS-only animation.
 * Props:
 *  - items: [{ id?, name?, logo_url }]
 *  - height: number (px)
 *  - gap: number (px)
 *  - duration: number (seconds) – speed of one full loop
 */
export default function CollabMarquee({ items = [], height = 84, gap = 28, duration = 30 }) {
  // Siapkan 1 baris konten, lalu gandakan (2x) agar seamless saat discroll
  const track = useMemo(() => {
    const base = (items || []).map((c, i) => ({
      key: `${c.id || i}-a`,
      src: asAbsolute(c.logo_url),
      alt: c.name || "collab",
    }));
    const dup  = (items || []).map((c, i) => ({
      key: `${c.id || i}-b`,
      src: asAbsolute(c.logo_url),
      alt: c.name || "collab",
    }));
    return [...base, ...dup];
  }, [items]);

  return (
    <div
      className="collab-marquee"
      style={{ "--marquee-height": `${height}px`, "--marquee-gap": `${gap}px`, "--marquee-duration": `${duration}s` }}
    >
      <div className="collab-track">
        {track.map((it) => (
          <div className="collab-item" key={it.key} title={it.alt}>
            <img src={it.src} alt={it.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}
