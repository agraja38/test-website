import Image from "next/image";
import taskManagerProImg from "../../public/app-screenshots/task-manager-pro.png";
import type { CSSProperties } from "react";
import type { AppDefinition } from "@/lib/apps";

type DemoPreviewProps = {
  app: AppDefinition;
};

const placeholderScreenshot = "/app-screenshots/dummy.svg";

export function DemoPreview({ app }: DemoPreviewProps) {
  return (
    <div className="demo-frame" style={{ "--accent": app.accent } as CSSProperties}>
      <div className="demo-titlebar">
        <span />
        <span />
        <span />
      </div>
      {app.screenshot === "metrics" ? <MetricsDemo /> : <PlaceholderDemo />}
    </div>
  );
}

function MetricsDemo() {
  return (
    <div className="demo-body">
      <Image 
        src={taskManagerProImg} 
        alt="Task Manager Pro Screenshot"
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover", 
          borderRadius: "8px"
        }} 
      />
    </div>
  );
}

function PlaceholderDemo() {
  return (
    <div className="demo-body">
      <Image
        src={placeholderScreenshot}
        alt="App screenshot placeholder"
        width={1280}
        height={720}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
