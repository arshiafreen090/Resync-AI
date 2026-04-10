'use client';

import { MOCK_ANALYTICS } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function ScoreHistoryChart() {
  const data = MOCK_ANALYTICS.history;

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-ink">Score Over Time</h3>
        <span className="text-[12px] text-ink/40">Last 30 days</span>
      </div>

      <div className="w-full h-[160px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A56FF" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#1A56FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'rgba(14,12,10,0.3)', fontFamily: 'var(--font-dm-sans)' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'rgba(14,12,10,0.3)', fontFamily: 'var(--font-dm-sans)' }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontSize: '12px',
                fontFamily: 'var(--font-dm-sans)'
              }}
              itemStyle={{ color: '#0E0C0A', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#1A56FF" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorScore)" 
              activeDot={{ r: 5, fill: '#1A56FF', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
