"use client";

import Image from "next/image";
import { ArrowUpRight, Download, ExternalLink, RefreshCw } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import type { AppDefinition } from "@/lib/apps";
import { formatBytes, normalizeFeed, type FeedState } from "@/lib/downloads";
import { DemoPreview } from "./demo-preview";

type AppCardProps = {
  app: AppDefinition;
  selectedPlatform: string;
};

export function AppCard({ app, selectedPlatform }: AppCardProps) {
  const [feed, setFeed] = useState<FeedState>({ downloads: [] });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const feedURLs = app.feedURLs ?? [app.feedURL];

    Promise.all(
      feedURLs.map((feedURL) =>
        fetch(`${feedURL}?v=${Date.now()}`, { cache: "no-store" })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
          })
          .then((data) => normalizeFeed(app.slug, data, feedURL))
      )
    )
      .then((feeds) => {
        if (!cancelled) {
          setFeed({
            version: feeds.map((item) => item.version).filter(Boolean).join(" / "),
            notes: feeds.map((item) => item.notes).filter(Boolean).join(" "),
            releaseNotesURL: feeds.find((item) => item.releaseNotesURL)?.releaseNotesURL,
            downloads: feeds.flatMap((item) => item.downloads),
          });
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [app]);

  const downloads = useMemo(() => {
    if (selectedPlatform === "All") return feed.downloads;
    return feed.downloads.filter((item) => item.platform === selectedPlatform);
  }, [feed.downloads, selectedPlatform]);

  const primary = downloads.find((item) => item.primary) ?? downloads[0];
  const Icon = app.Icon;

  return (
    <article className="app-card" id={app.slug} style={{ "--accent": app.accent } as CSSProperties}>
      <div className="app-card-copy">
        <div className="app-heading">
          <div className="app-icon">
            {app.icon ? <Image src={app.icon} alt="" width={56} height={56} /> : <Icon size={31} />}
          </div>
          <div>
            <span className="category">{app.category}</span>
            <h3>{app.displayName}</h3>
          </div>
        </div>

        <p className="tagline">{app.tagline}</p>
        <p className="description">{app.description}</p>

        <div className="version-row">
          {status === "loading" && <><RefreshCw size={15} className="spin" /> Reading live feed</>}
          {status === "ready" && <><span className="live-dot" /> Latest {feed.version ? `v${feed.version}` : "feed loaded"}</>}
          {status === "error" && <>Feed unavailable</>}
        </div>

        <div className="highlight-list">
          {app.highlights.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="download-panel">
          {primary ? (
            <a className="primary-download" href={primary.url}>
              <Download size={18} />
              Download {primary.label}
              <span>{primary.fileType}</span>
            </a>
          ) : (
            <button className="primary-download unavailable" disabled>
              <Download size={18} />
              {feed.unavailableReason ?? "Download coming soon"}
            </button>
          )}

          {downloads.length > 1 && (
            <div className="download-list">
              {downloads.map((item) => (
                <a key={`${item.label}-${item.url}`} href={item.url}>
                  <span>{item.label}</span>
                  <small>{[item.fileType, formatBytes(item.sizeBytes)].filter(Boolean).join(" · ")}</small>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          )}

          {feed.releaseNotesURL && (
            <a className="release-link" href={feed.releaseNotesURL}>
              Release notes <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <DemoPreview app={app} />
    </article>
  );
}
