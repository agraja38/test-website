import type { AppSlug, Platform } from "./apps";

type GenericFeed = Record<string, unknown>;

export type DownloadOption = {
  label: string;
  platform: Platform;
  arch?: string;
  url: string;
  fileType: string;
  sizeBytes?: number | null;
  primary?: boolean;
};

export type FeedState = {
  version?: string;
  notes?: string;
  updatedAt?: string;
  releaseNotesURL?: string;
  downloads: DownloadOption[];
  unavailableReason?: string;
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | null | undefined {
  return typeof value === "number" ? value : value === null ? null : undefined;
}

function fileTypeFromURL(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".dmg")) return "DMG";
  if (clean.endsWith(".exe")) return "EXE";
  if (clean.endsWith(".zip")) return "ZIP";
  if (clean.endsWith(".tar.gz")) return "TAR.GZ";
  return "Download";
}

function option(label: string, platform: Platform, url: string, arch?: string, sizeBytes?: number | null, primary = false): DownloadOption {
  return {
    label,
    platform,
    arch,
    url,
    sizeBytes,
    primary,
    fileType: fileTypeFromURL(url),
  };
}

export function normalizeFeed(slug: AppSlug, feed: GenericFeed, feedURL = ""): FeedState {
  const version = asString(feed.version);
  const notes = asString(feed.notes);
  const releaseNotesURL =
    asString(feed.releaseNotesURL) ?? asString(feed.releaseNotesUrl) ?? asString(feed.release_notes_url);

  if (slug === "task-manager-pro") {
    const arm = asString(feed.arm64AssetURL);
    const intel = asString(feed.x86_64AssetURL);
    return {
      version,
      notes,
      releaseNotesURL,
      downloads: [
        ...(arm ? [option("Apple Silicon", "macOS", arm, "arm64", undefined, true)] : []),
        ...(intel ? [option("Intel Mac", "macOS", intel, "x64")] : []),
      ],
    };
  }

  if (slug === "fetchlater") {
    const downloads = Array.isArray(feed.downloads)
      ? feed.downloads
          .map((item): DownloadOption | null => {
            if (!item || typeof item !== "object") return null;
            const row = item as GenericFeed;
            const url = asString(row.url);
            const platform = asString(row.platform) as Platform | undefined;
            const arch = asString(row.arch);
            if (!url || !platform) return null;
            const isInstaller = Boolean(row.updateAsset) || url.endsWith(".dmg");
            return option(
              `${platform}${arch ? ` ${arch}` : ""}`,
              platform,
              url,
              arch,
              asNumber(row.sizeBytes),
              isInstaller,
            );
          })
          .filter((item): item is DownloadOption => Boolean(item))
      : [];

    return { version, notes, releaseNotesURL, updatedAt: asString(feed.publishedAt), downloads };
  }

  if (slug === "justquit") {
    const isWindowsFeed = feedURL.includes("justquit-windows");
    const zipURL = asString(feed.downloadURL);
    const dmgURL = zipURL?.replace("/justQuit.zip", "/justQuit.dmg");
    const x64URL = asString(feed.downloadUrl);
    const armURL = x64URL?.replace("justQuit-Setup-x64.exe", "justQuit-Setup-ARM64.exe");

    return {
      version,
      notes,
      releaseNotesURL,
      downloads: [
        ...(!isWindowsFeed && dmgURL ? [option("macOS installer", "macOS", dmgURL, undefined, undefined, true)] : []),
        ...(!isWindowsFeed && zipURL ? [option("In-app update ZIP", "macOS", zipURL, undefined, asNumber(feed.sizeBytes))] : []),
        ...(isWindowsFeed && x64URL ? [option("Windows x64", "Windows", x64URL, "x64", asNumber(feed.sizeBytes), true)] : []),
        ...(isWindowsFeed && armURL ? [option("Windows ARM64", "Windows", armURL, "arm64")] : []),
      ],
    };
  }

  if (slug === "winswitch") {
    const x64URL = asString(feed.downloadUrl);
    const armURL = x64URL?.replace("WinSwitch-Setup-x64.exe", "WinSwitch-Setup-ARM64.exe");

    return {
      version,
      notes,
      releaseNotesURL,
      downloads: [
        ...(x64URL ? [option("Windows x64", "Windows", x64URL, "x64", asNumber(feed.sizeBytes), true)] : []),
        ...(armURL ? [option("Windows ARM64", "Windows", armURL, "arm64")] : []),
      ],
    };
  }

  const packageURL = asString(feed.packageURL);
  return {
    version,
    notes,
    releaseNotesURL,
    downloads: packageURL ? [option("Linux package", "Linux", packageURL, undefined, asNumber(feed.sizeBytes), true)] : [],
    unavailableReason: packageURL ? undefined : "Public package coming soon",
  };
}

export function formatBytes(bytes?: number | null) {
  if (!bytes) return undefined;
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}
