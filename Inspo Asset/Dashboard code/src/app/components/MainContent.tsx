import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { UserPlus, ArrowUpRight, CalendarDays, TrendingUp, TrendingDown } from "lucide-react";

const AVATAR_URL =
  "/Inspo Asset/Placeholder image.jpeg";

// Analytics area chart data
const analyticsData = [
  { time: "Aug 4", value: 20 },
  { time: "Aug 5", value: 35 },
  { time: "Aug 6", value: 28 },
  { time: "Aug 7", value: 45 },
  { time: "Aug 8", value: 38 },
  { time: "Aug 9", value: 55 },
  { time: "Aug 10", value: 60 },
  { time: "Aug 11", value: 58 },
  { time: "01 Jul", value: 65 },
  { time: "", value: 72 },
  { time: "", value: 68 },
  { time: "", value: 75 },
  { time: "", value: 82 },
  { time: "", value: 88 },
  { time: "", value: 85 },
  { time: "", value: 92 },
];

// Bar chart data for Data Insights
const barData = [
  { month: "Jan", submitted: 8000, ats: 6000, matched: 4000 },
  { month: "Feb", submitted: 12000, ats: 9000, matched: 5000 },
  { month: "Mar", submitted: 10000, ats: 7500, matched: 4500 },
  { month: "Apr", submitted: 15000, ats: 11000, matched: 7000 },
  { month: "May", submitted: 14000, ats: 10000, matched: 6000 },
  { month: "Jun", submitted: 18000, ats: 13000, matched: 8000 },
  { month: "Jul", submitted: 16000, ats: 12000, matched: 7500 },
  { month: "Aug", submitted: 20000, ats: 15000, matched: 9000 },
];

// Sparkline data
const sparklineData = [
  { v: 30 },
  { v: 45 },
  { v: 35 },
  { v: 50 },
  { v: 40 },
  { v: 38 },
  { v: 42 },
];

const statsCards = [
  {
    label: "Total Analyzed",
    value: "25.3k",
    delta: "+5%",
    positive: true,
    color: "#4361ee",
  },
  {
    label: "Shortlisted",
    value: "1.3k",
    delta: "-4%",
    positive: false,
    color: "#52c67f",
  },
  {
    label: "Strong Match",
    value: "5.3k",
    delta: "-2%",
    positive: false,
    color: "#f4b942",
  },
  {
    label: "Weak Match",
    value: "25.3k",
    delta: "+5%",
    positive: true,
    color: "#a78bfa",
  },
];

const CustomDot = (props: any) => {
  const { cx, cy, index } = props;
  if (index === 8) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#fff"
        stroke="#4361ee"
        strokeWidth={2}
      />
    );
  }
  return null;
};

export function MainContent() {
  return (
    <div className="flex-1 overflow-hidden" style={{ background: "#f8f9fc", padding: "20px" }}>
      {/* Greeting + Action Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: "46px", height: "46px" }}>
            <img
              src={AVATAR_URL}
              alt="Afreen Aurshi"
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.5) translateY(5%)" }}
            />
          </div>
          <div>
            <h2
              className="text-gray-900 flex items-center gap-1.5"
              style={{ fontSize: "17px", fontWeight: 600 }}
            >
              Hi, Afreen Aurshi
              <span>👋</span>
            </h2>
            <p className="text-gray-500" style={{ fontSize: "12.5px" }}>
              Effortlessly analyze resumes with a click.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            style={{ fontSize: "12.5px", fontWeight: 500 }}
          >
            <UserPlus size={14} />
            Invite User
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
            style={{
              fontSize: "12.5px",
              fontWeight: 500,
              background: "linear-gradient(135deg, #4361ee, #5a73f0)",
            }}
          >
            Analyze New Resume
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Analytics Card */}
      <div
        className="bg-white rounded-xl mb-4"
        style={{ border: "1px solid #f0f1f5" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
          <h3
            className="text-gray-800"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            Total Analysis
          </h3>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
            style={{ fontSize: "11.5px" }}
          >
            <CalendarDays size={12} />
            Aug 04 - Aug 11 2023
          </div>
        </div>

        {/* Chart Row */}
        <div className="flex" style={{ height: "180px" }}>
          {/* Left: Percentage + sparkline */}
          <div
            className="flex flex-col justify-between px-5 py-4 border-r border-gray-50"
            style={{ width: "220px", flexShrink: 0 }}
          >
            <div>
              <div
                className="text-gray-900"
                style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.1 }}
              >
                78%
              </div>
              <p className="text-gray-400 mt-1" style={{ fontSize: "11px" }}>
                Match rate within specified timeframe
              </p>
            </div>

            {/* Mini sparkline */}
            <div>
              <div style={{ height: "40px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sparklineData}
                    margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4361ee" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#4361ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#4361ee"
                      strokeWidth={1.5}
                      fill="url(#sparkGrad)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-white"
                  style={{ fontSize: "10px", fontWeight: 600, background: "#52c67f" }}
                >
                  ▴ 6%
                </span>
              </div>
              <p className="text-gray-400 mt-1" style={{ fontSize: "10px" }}>
                Analysis during selected time range
              </p>
            </div>
          </div>

          {/* Right: Area Chart */}
          <div className="flex-1 flex flex-col px-2 pt-2 pb-1">
            <div className="flex items-center justify-between px-3 mb-1">
              <div className="flex items-center gap-1.5">
                <div
                  className="rounded-sm"
                  style={{ width: "3px", height: "14px", background: "#4361ee" }}
                />
                <span className="text-gray-700" style={{ fontSize: "12px", fontWeight: 500 }}>
                  Analytics
                </span>
              </div>
              <button
                className="px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontSize: "11px" }}
              >
                Details
              </button>
            </div>
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4361ee" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#4361ee" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f1f5"
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <ReferenceLine
                    x="01 Jul"
                    stroke="#4361ee"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label={{
                      value: "01 Jul",
                      position: "top",
                      fontSize: 9,
                      fill: "#6b7280",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: "11px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#4361ee"
                    strokeWidth={2}
                    fill="url(#areaGrad)"
                    dot={<CustomDot />}
                    activeDot={{ r: 4, fill: "#4361ee" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 border-t border-gray-50">
          {statsCards.map((stat, index) => (
            <div
              key={stat.label}
              className="px-5 py-3.5"
              style={{
                borderRight: index < 3 ? "1px solid #f0f1f5" : "none",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div
                  className="rounded-sm"
                  style={{ width: "8px", height: "8px", background: stat.color, borderRadius: "2px" }}
                />
                <span className="text-gray-500" style={{ fontSize: "11px" }}>
                  {stat.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-gray-900"
                  style={{ fontSize: "16px", fontWeight: 700 }}
                >
                  {stat.value}
                </span>
                <span
                  className="flex items-center gap-0.5"
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 600,
                    color: stat.positive ? "#52c67f" : "#ef4444",
                  }}
                >
                  {stat.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {stat.delta}
                </span>
              </div>
              {/* Mini progress bar */}
              <div
                className="mt-1.5 rounded-full overflow-hidden"
                style={{ height: "3px", background: "#f0f1f5" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: stat.positive ? "65%" : "40%",
                    background: stat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Insights */}
      <div
        className="bg-white rounded-xl"
        style={{ border: "1px solid #f0f1f5" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3
            className="text-gray-800"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            Data Insights
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {[
                { color: "#52c67f", label: "Resume Submitted" },
                { color: "#f4b942", label: "ATS Score" },
                { color: "#a78bfa", label: "Job Matched" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div
                    className="rounded-full"
                    style={{
                      width: "7px",
                      height: "7px",
                      background: item.color,
                    }}
                  />
                  <span className="text-gray-500" style={{ fontSize: "10.5px" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              style={{ fontSize: "11px" }}
            >
              Last Year
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 4L5 7L8 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ height: "160px", paddingBottom: "12px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 0, right: 20, left: -5, bottom: 0 }}
              barSize={7}
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f1f5"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  fontSize: "11px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                formatter={(value: number) => [`${(value / 1000).toFixed(1)}k`]}
              />
              <Bar dataKey="submitted" fill="#52c67f" radius={[3, 3, 0, 0]} opacity={0.85} />
              <Bar dataKey="ats" fill="#f4b942" radius={[3, 3, 0, 0]} opacity={0.85} />
              <Bar dataKey="matched" fill="#a78bfa" radius={[3, 3, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
