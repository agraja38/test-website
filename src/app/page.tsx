"use client";

import { useMemo, useState } from "react";
import { ArrowDown, Github, MonitorDown, Search } from "lucide-react";
import { AppCard } from "@/components/app-card";
import { appDefinitions, statCards } from "@/lib/apps";

const platforms = ["All", "macOS", "Windows", "Linux"];

export default function Home() {
  const [platform, setPlatform] = useState("All");
  const [query, setQuery] = useState("");

  const apps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return appDefinitions.filter((app) => {
      const platformMatch = platform === "All" || app.platforms.includes(platform as never);
      const queryMatch =
        !normalized ||
        `${app.displayName} ${app.category} ${app.description} ${app.highlights.join(" ")}`
          .toLowerCase()
          .includes(normalized);
      return platformMatch && queryMatch;
    });
  }, [platform, query]);

  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <a className="brand" href="#">
            <span><MonitorDown size={21} /></span>
            Agraja Apps
          </a>
          <div className="nav-actions">
            <a href="https://github.com/agraja38/app-update-feeds"><Github size={18} /> Update feeds</a>
            <a href="#apps">Downloads <ArrowDown size={16} /></a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Install the latest apps from Agraja</h1>
            <div className="hero-actions">
              <a className="cta" href="#apps">Browse apps</a>
              <a className="secondary-cta" href="https://raw.githubusercontent.com/agraja38/app-update-feeds/main/apps.json">
                View catalog
              </a>
            </div>
          </div>

          <div className="hero-board" aria-label="Live release status preview">
            <div className="release-terminal">
              <div className="terminal-top"><span /><span /><span /></div>
              <code>app-update-feeds/main/apps.json</code>
              <div className="release-lines">
                <span><b>Task Manager Pro</b><em>macOS DMG</em></span>
                <span><b>FetchLater</b><em>macOS · Windows</em></span>
                <span><b>justQuit</b><em>Mac and Windows</em></span>
                <span><b>WinSwitch</b><em>Windows x64 · ARM64</em></span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-row">
          {statCards.map(({ label, value, Icon }) => (
            <div key={label} className="stat-card">
              <Icon size={20} />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="apps-section" id="apps">
        <div className="section-header">
          <div>
            <span className="eyebrow">Downloads</span>
            <h2>Choose your app and platform</h2>
          </div>
          <div className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apps" />
          </div>
        </div>

        <div className="platform-tabs" role="tablist" aria-label="Filter by platform">
          {platforms.map((item) => (
            <button
              key={item}
              className={platform === item ? "active" : ""}
              onClick={() => setPlatform(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="app-grid">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} selectedPlatform={platform} />
          ))}
        </div>
      </section>

      <footer>
        <span>&copy; Copyright Agraja 2026</span>
      </footer>
    </main>
  );
}
