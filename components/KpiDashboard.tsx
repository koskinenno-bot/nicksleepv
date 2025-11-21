
import React from 'react';
import { KpiItem } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface Props {
  kpis?: KpiItem[];
}

const KpiDashboard: React.FC<Props> = ({ kpis }) => {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="bg-nomad-800 rounded-xl border border-nomad-700 shadow-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-nomad-700 flex justify-between items-baseline bg-gradient-to-r from-nomad-800 to-nomad-900">
        <div>
            <h2 className="text-2xl font-serif text-nomad-50">
            Operating KPIs
            </h2>
            <p className="text-nomad-400 text-sm mt-1">
            Key drivers of business performance
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-nomad-700">
        {kpis.map((kpi, index) => {
            const sortedData = [...kpi.data].sort((a, b) => parseInt(a.year) - parseInt(b.year));
            
            if (sortedData.length === 0) return null;

            const latestItem = sortedData[sortedData.length - 1];
            const firstItem = sortedData[0];
            const prevItem = sortedData.length > 1 ? sortedData[sortedData.length - 2] : null;

            const latestValue = latestItem.value;
            
            // CAGR Calculation
            const years = sortedData.length - 1;
            const cagr = years > 0 && firstItem.value > 0 
              ? (Math.pow(latestValue / firstItem.value, 1 / years) - 1) 
              : 0;

            // Latest YoY Calculation
            const yoy = prevItem && prevItem.value !== 0
              ? (latestValue - prevItem.value) / prevItem.value
              : 0;

            // Prepare chart data with YoY for each point for tooltips
            const chartData = sortedData.map((item, i, arr) => {
                const prev = arr[i-1];
                const growth = prev && prev.value !== 0 
                    ? ((item.value - prev.value) / prev.value) 
                    : 0;
                return {
                    ...item,
                    growth: growth
                };
            });

            return (
                <div key={index} className="p-6 flex flex-col h-80 bg-nomad-800 hover:bg-nomad-800/80 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 pr-4">
                            <h3 className="text-nomad-200 font-medium text-xs uppercase tracking-wider h-8 line-clamp-2 flex items-center" title={kpi.title}>
                                {kpi.title}
                            </h3>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-serif text-white tracking-tight">
                                    {latestValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                </span>
                                <span className="text-xs text-nomad-500 font-medium">{kpi.unit}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 min-w-[80px]">
                             {/* YoY Badge */}
                            <div className={`text-xs font-bold px-2 py-0.5 rounded border flex items-center justify-end w-full ${yoy >= 0 ? 'bg-green-900/20 text-green-400 border-green-900/30' : 'bg-red-900/20 text-red-400 border-red-900/30'}`}>
                                <span className="opacity-60 font-normal mr-1 text-[9px] uppercase">YoY</span>
                                {yoy > 0 ? '+' : ''}{(yoy * 100).toFixed(1)}%
                            </div>
                            {/* CAGR Badge */}
                             {years > 1 && (
                                <div className="text-[10px] text-nomad-400 font-mono flex justify-end w-full items-center">
                                    <span className="opacity-60 mr-1">CAGR</span> 
                                    <span className={`font-medium ${cagr >= 0 ? "text-yellow-500" : "text-red-400"}`}>{(cagr * 100).toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
                                <XAxis 
                                    dataKey="year" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    dy={5}
                                />
                                <YAxis 
                                    hide 
                                />
                                <Tooltip 
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-[#0f172a] border border-nomad-600 p-3 text-xs shadow-xl rounded-lg z-50">
                                                    <div className="text-nomad-400 mb-1">{label}</div>
                                                    <div className="text-white font-bold text-sm mb-1">
                                                        {data.value.toLocaleString()} <span className="text-nomad-500 font-normal text-xs">{kpi.unit}</span>
                                                    </div>
                                                    {data.growth !== 0 && (
                                                        <div className={`flex items-center gap-1 ${data.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                           <span>{data.growth > 0 ? '↗' : '↘'}</span>
                                                           <span>{data.growth > 0 ? '+' : ''}{(data.growth * 100).toFixed(1)}%</span>
                                                           <span className="text-nomad-600">YoY</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index === chartData.length - 1 ? '#eab308' : '#475569'} 
                                            fillOpacity={index === chartData.length - 1 ? 1 : 0.7}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-nomad-500 mt-3 truncate" title={kpi.description}>
                        {kpi.description}
                    </p>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default KpiDashboard;