import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2, ArrowUpRight, ExternalLink } from "lucide-react";

const AVATAR_URL =
  "/Inspo Asset/Placeholder image.jpeg";

const donutData = [
  { name: "ATS Pass", value: 60 },
  { name: "Improvement Needed", value: 25 },
  { name: "Strong Match", value: 15 },
];

const DONUT_COLORS = ["#4361ee", "#f4b942", "#52c67f"];

function ResumeBot({ size = 28 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0 bg-transparent"
      style={{
        width: size,
        height: size,
      }}
    >
      <img src="/assets/favicon.svg" alt="ResumeBot" width={size} height={size} />
    </div>
  );
}

export function RightPanel() {
  return (
    <div
      className="flex flex-col bg-white border-l border-gray-100"
      style={{ width: "260px", minWidth: "260px", flexShrink: 0 }}
    >
      {/* RESUME AI Chat */}
      <div className="p-4 border-b border-gray-100">
        <p
          className="text-gray-800 mb-3"
          style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em" }}
        >
          RESUME AI
        </p>

        {/* Bot message 1 */}
        <div className="flex items-start gap-2 mb-3">
          <ResumeBot size={26} />
          <div
            className="flex-1 rounded-xl rounded-tl-sm p-2.5 bg-gray-50"
            style={{ fontSize: "11.5px", color: "#374151" }}
          >
            <p className="text-gray-800 mb-0.5" style={{ fontWeight: 600, fontSize: "11.5px" }}>
              ResumeBot
            </p>
            <p>Hi Afreen! Ready to analyze your resume today?</p>
          </div>
        </div>

        {/* User message */}
        <div className="flex items-start gap-2 mb-3 justify-end">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-gray-500" style={{ fontSize: "11px" }}>
                Afreen Aurshi
              </span>
              <span className="text-gray-400" style={{ fontSize: "10px" }}>
                Jan 27, 2024
              </span>
              <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: "20px", height: "20px" }}>
                <img
                  src={AVATAR_URL}
                  alt="Afreen"
                  className="w-full h-full object-cover"
                  style={{ transform: "scale(1.5) translateY(5%)" }}
                />
              </div>
            </div>
            <div
              className="rounded-xl rounded-tr-sm p-2.5 bg-blue-50"
              style={{ fontSize: "11.5px", color: "#374151", maxWidth: "140px" }}
            >
              <p>how does my resume score</p>
            </div>
          </div>
        </div>

        {/* Bot processing */}
        <div className="flex items-start gap-2">
          <ResumeBot size={26} />
          <div
            className="flex-1 rounded-xl rounded-tl-sm p-2.5 bg-gray-50"
          >
            <p className="text-gray-800 mb-1" style={{ fontWeight: 600, fontSize: "11.5px" }}>
              ResumeBot
            </p>
            <div className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: "11px" }}>
              <Loader2 size={11} className="animate-spin" />
              <span>Processing...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Scorer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-gray-800"
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            Resume Scorer
          </p>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            style={{ fontSize: "11px" }}
          >
            View all
          </button>
        </div>

        {/* Donut Chart */}
        <div className="relative" style={{ height: "110px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div
            className="absolute flex flex-col items-center"
            style={{ bottom: "8px", left: "50%", transform: "translateX(-50%)" }}
          >
            <span
              className="text-gray-400 uppercase tracking-widest"
              style={{ fontSize: "8px", fontWeight: 600 }}
            >
              Resumes
            </span>
            <span
              className="text-gray-900"
              style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.1 }}
            >
              800
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-1.5 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{ width: "8px", height: "8px", background: "#52c67f", flexShrink: 0 }}
              />
              <span className="text-gray-600" style={{ fontSize: "11.5px" }}>
                ATS Pass
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-800" style={{ fontSize: "11.5px", fontWeight: 600 }}>
                24
              </span>
              <span
                className="flex items-center"
                style={{ fontSize: "10px", color: "#52c67f", fontWeight: 600 }}
              >
                60% <ArrowUpRight size={9} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{ width: "8px", height: "8px", background: "#f4b942", flexShrink: 0 }}
              />
              <span className="text-gray-600" style={{ fontSize: "11.5px" }}>
                Needs Work
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-800" style={{ fontSize: "11.5px", fontWeight: 600 }}>
                12
              </span>
              <span style={{ fontSize: "10px", color: "#9ca3af" }}>...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
