import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { ChatNavbar } from "./ChatNavbar";

export function AppShell() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(() => {
    const saved = localStorage.getItem("ember-right-sidebar-open");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("ember-right-sidebar-open", String(rightOpen));
  }, [rightOpen]);

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: "var(--ember-void)" }}>
      <LeftSidebar isOpen={leftOpen} onToggle={() => setLeftOpen(!leftOpen)} />
      <div className="flex-1 flex flex-col min-w-0 ember-content-gradient">
        <ChatNavbar
          leftSidebarOpen={leftOpen}
          onToggleLeftSidebar={() => setLeftOpen(!leftOpen)}
          rightSidebarOpen={rightOpen}
          onToggleRightSidebar={() => setRightOpen(!rightOpen)}
        />
        <Outlet />
      </div>
      <RightSidebar isOpen={rightOpen} onToggle={() => setRightOpen(!rightOpen)} />
    </div>
  );
}
