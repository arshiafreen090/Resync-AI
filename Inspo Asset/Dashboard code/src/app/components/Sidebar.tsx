import image_b1f2aa1e0da4cd06bad30b19144ce62df2854176 from 'figma:asset/b1f2aa1e0da4cd06bad30b19144ce62df2854176.png'
import React from "react";
import LogoFinal from "../../imports/Logo_Final.svg";
import {
  LayoutDashboard,
  Search,
  BarChart2,
  Users,
  Briefcase,
  Inbox,
  Link2,
  Settings,
  HelpCircle,
  Gift,
  ChevronRight,
  Plus,
  PanelLeftClose,
} from "lucide-react";

const mainMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Search, label: "Resume Search", hasChevron: true },
  { icon: BarChart2, label: "Analytics" },
  { icon: Users, label: "Candidates" },
  { icon: Briefcase, label: "Job Matches", hasPlus: true },
  { icon: Inbox, label: "Inbox Pro" },
  { icon: Link2, label: "Integrations" },
];

const otherMenuItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Support" },
  { icon: Gift, label: "Refer A Friend" },
];

export function Sidebar() {
  return (
    <div
      className="flex flex-col bg-white border-r border-gray-100"
      style={{ width: "220px", minHeight: "100vh", flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">

          <div className="flex items-center gap-2">
            <img
              src="/assets/favicon.svg"
              alt="ReSync AI Logo"
              className="h-[22px] w-[22px]"
            />
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
              ReSync AI
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Main Menu */}
      <div className="px-3 pt-5 flex-1">
        <p
          className="text-gray-400 px-2 mb-2"
          style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          Main Menu
        </p>
        <nav className="space-y-0.5">
          {mainMenuItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center w-full px-2 py-2 rounded-md text-left transition-colors group"
              style={{
                fontSize: "13px",
                fontWeight: item.active ? 500 : 400,
                color: item.active ? "#4361ee" : "#6b7280",
                background: item.active ? "#eef0fd" : "transparent",
                borderLeft: item.active ? "2px solid #4361ee" : "2px solid transparent",
              }}
            >
              <item.icon
                size={15}
                className="mr-2.5 flex-shrink-0"
                style={{ color: item.active ? "#4361ee" : "#9ca3af" }}
              />
              <span className="flex-1">{item.label}</span>
              {item.hasChevron && (
                <ChevronRight size={13} style={{ color: "#9ca3af" }} />
              )}
              {item.hasPlus && (
                <Plus size={13} style={{ color: "#9ca3af" }} />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Other Menu */}
      <div className="px-3 pb-5">
        <p
          className="text-gray-400 px-2 mb-2"
          style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          Other Menu
        </p>
        <nav className="space-y-0.5">
          {otherMenuItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center w-full px-2 py-2 rounded-md text-left hover:bg-gray-50 transition-colors"
              style={{ fontSize: "13px", fontWeight: 400, color: "#6b7280" }}
            >
              <item.icon size={15} className="mr-2.5 flex-shrink-0" style={{ color: "#9ca3af" }} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
