
import React from 'react';
import { CapitalAllocationData } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface Props {
  data: CapitalAllocationData[];
}

const CapitalAllocation: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-2xl">
      <div className="flex justify-between items-end mb-8 border-b border-nomad-700 pb-4">
        <div>
          <h2 className="text-2xl font-serif text-nomad-50 tracking-tight">Capital Allocation</h2>
          <p className="text-xs text-nomad-500 mt-1 uppercase tracking-widest font-semibold">Moat Widening vs. Harvesting</p>
        </div>
        <div className="hidden md:flex gap-4 text-[10px] uppercase tracking-wider font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-nomad-400">Reinvestment (Moat)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
            <span className="text-nomad-400">Payout (Harvest)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
              <XAxis dataKey="year" stroke="#64748b" tick={{fontSize: 12}} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} label={{ value: 'Amount ($B)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#f1f5f9' }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
              <Bar dataKey="reinvestment" name="Reinvestment (CapEx + R&D)" fill="#3b82f6" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
              <Bar dataKey="payout" name="Payout (Div + Buybacks)" fill="#ca8a04" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full md:w-1/3 space-y-4 flex flex-col justify-center">
          <div className="bg-nomad-900/50 p-5 rounded-lg border border-nomad-700/50 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
              </svg>
              <h4 className="text-nomad-200 text-sm font-bold">Nomad Philosophy</h4>
            </div>
            <p className="text-nomad-400 text-xs leading-relaxed">
              Nick Sleep preferred companies that <span className="text-blue-400 font-medium">reinvested</span> heavily into the business to widen the moat. A high payout ratio (dividends/buybacks) can sometimes signal that the company has run out of high-return reinvestment opportunities.
            </p>
          </div>
          
          <div className="bg-nomad-900/50 p-5 rounded-lg border border-nomad-700/50 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-nomad-200 text-sm font-bold">The Gaze</h4>
            </div>
            <p className="text-nomad-400 text-xs leading-relaxed">
              If <span className="text-blue-400 font-medium">Reinvestment</span> is consistently higher than <span className="text-yellow-500 font-medium">Payout</span>, management is likely focused on building a much larger "destination" rather than harvesting short-term cash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalAllocation;
