import Image from "next/image";
import taskManagerProImg from "../../public/app-screenshots/task-manager-pro.png";
import type { CSSProperties } from "react";
import type { AppDefinition } from "@/lib/apps";

type DemoPreviewProps = {
  app: AppDefinition;
};

const placeholderScreenshot = (app: AppDefinition) =>
  app.slug === "task-manager-pro"
    ? taskManagerProImg
    : `/app-screenshots/${app.slug}-placeholder.svg`;

export function DemoPreview({ app }: DemoPreviewProps) {
  return (
    <div className="demo-frame" style={{ "--accent": app.accent } as CSSProperties}>
      <div className="demo-titlebar">
        <span />
        <span />
        <span />
      </div>
      <ScreenshotDemo app={app} />
    </div>
  );
}

function ScreenshotDemo({ app }: { app: AppDefinition }) {
  return (
    <div className="demo-body">
      <Image
        src={placeholderScreenshot(app)}
        alt={
          app.slug === "task-manager-pro"
            ? "Task Manager Pro Screenshot"
            : `${app.displayName} screenshot placeholder`
        }
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
