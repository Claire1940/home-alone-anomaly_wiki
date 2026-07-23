"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * Video feature with autoplay-on-scroll.
 *
 * Uses an IntersectionObserver to load and autoplay the YouTube iframe only
 * once the player scrolls into view (saves bandwidth and avoids multiple
 * simultaneous autoplayers). Before activation it shows a poster image with a
 * clickable play button as a fallback. After activation the iframe is mounted
 * with autoplay=1&mute=1&loop=1 (loop requires playlist=<videoId>).
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);

  // Environments without IntersectionObserver (SSR, very old browsers) fall
  // back to activating immediately so the video is always reachable.
  useEffect(() => {
    if (activated) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setActivated(true);
      return;
    }
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivated(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [activated]);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {activated ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            {/* Poster fallback */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            <span className="relative z-10 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg transition-transform group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 md:h-9 md:w-9" fill="currentColor" />
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
