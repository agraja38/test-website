import { Activity, ArrowLeftRight, CheckCircle2, Clock3, Cpu, Download, Fan, Gauge, HardDriveDownload, Network, Shield, Timer } from "lucide-react";
import type { CSSProperties } from "react";
import type { AppDefinition } from "@/lib/apps";

type DemoPreviewProps = {
  app: AppDefinition;
};

export function DemoPreview({ app }: DemoPreviewProps) {
  return (
    <div className="demo-frame" style={{ "--accent": app.accent } as CSSProperties}>
      <div className="demo-titlebar">
        <span />
        <span />
        <span />
      </div>
      {app.screenshot === "metrics" && <MetricsDemo />}
      {app.screenshot === "downloads" && <DownloadsDemo />}
      {app.screenshot === "network" && <NetworkDemo />}
      {app.screenshot === "quit" && <QuitDemo />}
      {app.screenshot === "windowsQuit" && <WindowsQuitDemo />}
      {app.screenshot === "switch" && <SwitchDemo />}
    </div>
  );
}

function MetricsDemo() {
  return (
    <div className="demo-body metrics-demo">
      <div className="metric-ring">
        <Gauge size={30} />
        <strong>42%</strong>
        <span>CPU</span>
      </div>
      <div className="mini-stack">
        <div><Cpu size={16} /> Memory <strong>7.6 GB</strong></div>
        <div><Fan size={16} /> Fan <strong>2,310 RPM</strong></div>
        <div><Activity size={16} /> Thermal <strong>Nominal</strong></div>
      </div>
    </div>
  );
}

function DownloadsDemo() {
  return (
    <div className="demo-body downloads-demo">
      <div className="download-row active"><HardDriveDownload size={18} /><span>Course archive.zip</span><b>68%</b></div>
      <div className="progress-track"><span style={{ width: "68%" }} /></div>
      <div className="download-row"><Clock3 size={18} /><span>Design pack.dmg</span><b>Tonight</b></div>
      <div className="download-row"><CheckCircle2 size={18} /><span>Invoices.pdf</span><b>Done</b></div>
    </div>
  );
}

function NetworkDemo() {
  return (
    <div className="demo-body network-demo">
      <div className="network-graph">
        <span style={{ height: "34%" }} />
        <span style={{ height: "62%" }} />
        <span style={{ height: "48%" }} />
        <span style={{ height: "76%" }} />
        <span style={{ height: "54%" }} />
        <span style={{ height: "88%" }} />
      </div>
      <div className="network-stat"><Network size={18} /> Today <strong>18.4 GB</strong></div>
      <div className="network-stat"><Download size={18} /> Month <strong>312 GB</strong></div>
    </div>
  );
}

function QuitDemo() {
  return (
    <div className="demo-body quit-demo">
      <div className="quit-count"><Timer size={22} /><strong>5</strong><span>seconds</span></div>
      <div className="protected"><Shield size={18} /> Finder protected</div>
      <div className="app-pills"><span>Mail</span><span>Notes</span><span>Preview</span></div>
    </div>
  );
}

function WindowsQuitDemo() {
  return (
    <div className="demo-body windows-demo">
      <div className="tray-panel">
        <strong>justQuit</strong>
        <span>Ctrl + Alt + J</span>
        <button>Quit 6 apps</button>
      </div>
      <div className="session-card">Restore last session</div>
    </div>
  );
}

function SwitchDemo() {
  return (
    <div className="demo-body switch-demo">
      <div className="window-tile left">Editor</div>
      <ArrowLeftRight size={34} />
      <div className="window-tile right">Browser</div>
      <div className="shortcut">Ctrl + Alt + Arrow</div>
    </div>
  );
}
