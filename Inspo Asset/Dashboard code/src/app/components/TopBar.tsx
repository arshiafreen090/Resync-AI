import React from "react";
import { Search, Bell, Mail, HelpCircle, ChevronDown } from "lucide-react";

const AVATAR_URL =
  "/Inspo Asset/Placeholder image.jpeg";

export function TopBar() {
  return (
    <div
      className="flex items-center bg-white border-b border-gray-100 px-5"
      style={{ height: "56px", flexShrink: 0 }}
    >
      {/* Search */}
      <div className="flex items-center gap-2 flex-1" style={{ maxWidth: "380px" }}>
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by name or resume"
          className="flex-1 outline-none text-gray-600 placeholder-gray-400 bg-transparent"
          style={{ fontSize: "13px" }}
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Upgrade Button */}
        <button
          className="px-4 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          UPGRADE
        </button>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md hover:bg-gray-50 text-gray-500 transition-colors">
            <Mail size={16} />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-50 text-gray-500 transition-colors">
            <HelpCircle size={16} />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-50 text-gray-500 transition-colors">
            <Bell size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-gray-200" />

        {/* User Info */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition-colors">
          <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: "30px", height: "30px" }}>
            <img
              src={AVATAR_URL}
              alt="Afreen Aurshi"
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.5) translateY(5%)" }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-gray-800" style={{ fontSize: "12px", fontWeight: 500 }}>
              Afreen Aurshi
            </span>
            <span className="text-gray-400" style={{ fontSize: "11px" }}>
              Admin
            </span>
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
