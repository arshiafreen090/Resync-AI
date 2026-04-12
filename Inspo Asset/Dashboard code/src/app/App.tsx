import React from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { MainContent } from "./components/MainContent";
import { RightPanel } from "./components/RightPanel";

export default function App() {
  return (
    <div
      className="flex"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#f8f9fc",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Content Row */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Dashboard Content */}
          <MainContent />

          {/* Right Panel */}
          <RightPanel />
        </div>
      </div>
    </div>
  );
}