import {
  Activity,
  AppWindow,
  ArrowLeftRight,
  Bell,
  Cpu,
  Download,
  Gauge,
  HardDriveDownload,
  Network,
  ShieldCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";

export type AppSlug =
  | "task-manager-pro"
  | "fetchlater"
  | "pinetmonitor"
  | "justquit"
  | "justquit-windows"
  | "winswitch";

export type Platform = "macOS" | "Windows" | "Linux";

export type AppDefinition = {
  slug: AppSlug;
  repoName: string;
  displayName: string;
  category: string;
  tagline: string;
  description: string;
  platforms: Platform[];
  icon?: string;
  Icon: LucideIcon;
  accent: string;
  screenshot: "metrics" | "downloads" | "network" | "quit" | "windowsQuit" | "switch";
  highlights: string[];
  feedURL: string;
};

const feedBase = "https://raw.githubusercontent.com/agraja38/app-update-feeds/main";

export const appDefinitions: AppDefinition[] = [
  {
    slug: "task-manager-pro",
    repoName: "Task-Manager-Pro",
    displayName: "Task Manager Pro",
    category: "macOS system utility",
    tagline: "Monitor performance, fans, thermals, and processes from one polished Mac dashboard.",
    description:
      "A native macOS control center for CPU, memory, process actions, thermal telemetry, fan controls, and safe in-app updates.",
    platforms: ["macOS"],
    Icon: Gauge,
    accent: "#19a7ce",
    screenshot: "metrics",
    highlights: ["Live CPU and memory insight", "Fan and thermal controls", "Safe process actions"],
    feedURL: `${feedBase}/task-manager-pro/update.json`,
  },
  {
    slug: "fetchlater",
    repoName: "FetchLater",
    displayName: "FetchLater",
    category: "scheduled download manager",
    tagline: "Add a link, pick a time, and let downloads start exactly when you want.",
    description:
      "A cross-platform desktop download manager with scheduling, validation, retries, progress tracking, and public update delivery.",
    platforms: ["macOS", "Windows"],
    icon: "/app-icons/fetchlater.png",
    Icon: HardDriveDownload,
    accent: "#3b82f6",
    screenshot: "downloads",
    highlights: ["Timed downloads", "Retry and validation tools", "macOS and Windows installers"],
    feedURL: `${feedBase}/fetchlater/update.json`,
  },
  {
    slug: "pinetmonitor",
    repoName: "PiNetMonitor",
    displayName: "PiNetMonitor",
    category: "network usage monitor",
    tagline: "Turn a Raspberry Pi or Orange Pi into an inline network usage dashboard.",
    description:
      "A lightweight Linux gateway monitor for SBC devices, daily and monthly traffic reports, and a local dashboard backed by SQLite.",
    platforms: ["Linux"],
    Icon: Network,
    accent: "#22c55e",
    screenshot: "network",
    highlights: ["Gateway-mode traffic reports", "SBC-friendly deployment", "Local web dashboard"],
    feedURL: `${feedBase}/pinetmonitor/update.json`,
  },
  {
    slug: "justquit",
    repoName: "justQuit",
    displayName: "justQuit",
    category: "macOS menu bar cleaner",
    tagline: "Close regular apps fast while keeping protected apps and background helpers alone.",
    description:
      "A native Mac menu bar app for quick app cleanup, protected app lists, countdowns, profiles, restore sessions, and update notifications.",
    platforms: ["macOS"],
    icon: "/app-icons/justquit.png",
    Icon: ShieldCheck,
    accent: "#ef4444",
    screenshot: "quit",
    highlights: ["Protected apps", "Countdown and cancel", "Profiles and restore sessions"],
    feedURL: `${feedBase}/justquit/update.json`,
  },
  {
    slug: "justquit-windows",
    repoName: "justQuit-Windows",
    displayName: "justQuit Windows",
    category: "Windows tray utility",
    tagline: "The justQuit workflow rebuilt for Windows with profiles, restore, and a global hotkey.",
    description:
      "A native Windows tray app for quitting selected apps, protecting important tools, saving profiles, and restoring the previous session.",
    platforms: ["Windows"],
    icon: "/app-icons/justquit-windows.png",
    Icon: AppWindow,
    accent: "#f97316",
    screenshot: "windowsQuit",
    highlights: ["Tray-first workflow", "Ctrl Alt J hotkey", "x64 and ARM64 installers"],
    feedURL: `${feedBase}/justquit-windows/update.json`,
  },
  {
    slug: "winswitch",
    repoName: "WinSwitch",
    displayName: "WinSwitch",
    category: "Windows app switcher",
    tagline: "Bring a macOS-like fullscreen swipe feeling to Windows app switching.",
    description:
      "A Windows switcher for keyboard shortcuts and mapped touchpad gestures, with fullscreen transition animation and update checks.",
    platforms: ["Windows"],
    icon: "/app-icons/winswitch.png",
    Icon: ArrowLeftRight,
    accent: "#8b5cf6",
    screenshot: "switch",
    highlights: ["Fullscreen slide animation", "Keyboard and touchpad flow", "Configurable settings"],
    feedURL: `${feedBase}/winswitch/update.json`,
  },
];

export const statCards = [
  { label: "Apps", value: "6", Icon: AppWindow },
  { label: "Platforms", value: "3", Icon: Cpu },
  { label: "Live feeds", value: "Auto", Icon: Activity },
  { label: "Public downloads", value: "Ready", Icon: Download },
];

export const trustItems = [
  { label: "Live links", detail: "Buttons read from app-update-feeds at runtime.", Icon: Bell },
  { label: "Private source", detail: "Only public release assets are exposed.", Icon: ShieldCheck },
  { label: "Fast install", detail: "Platform-specific downloads are one click away.", Icon: Timer },
];
