
import React from 'react';
import { CompanyData, AnalysisResult } from '../types';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area } from 'recharts';

interface Props {
  company: CompanyData;
  analysis: AnalysisResult;
}

const MoatAnalyzer: React.FC<Props> = ({ company, analysis }) => {
  
  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('wide')) return 'bg-green-900/30 text-green-400 border-green-800/50 shadow-[0_0_10px_rgba(74,222,128,0.1)]';
    if (v.includes('narrow')) return 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50';
    return 'bg-red-900/30 text-red-400 border-red-800/50';
  };

  return (
    <div className="space-y-8">
      
      {/* Financial Visuals */}
      <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-2xl">
         <div className="flex justify-between items-end mb-8 border-b border-nomad-700 pb-4">
            <h2 className="text-2xl font-serif text-nomad-50 tracking-tight">
              {analysis.moatSource && analysis.moatSource !== "Unknown" ? analysis.moatSource : "Scale Economics Shared"}
            </h2>
            <span className="text-xs text-nomad-500 uppercase tracking-widest font-semibold">5 Year Trend</span>
         </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 h-80">
             <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={company.financials}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis dataKey="year" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 12}} label={{ value: 'Rev ($B)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#eab308" tick={{fontSize: 12}} label={{ value: 'Margin %', angle: 90, position: 'insideRight', fill: '#eab308', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($B)" fill="#475569" barSize={40} radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="netMargin" name="Net Margin %" stroke="#eab308" strokeWidth={3} dot={{r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#eab308'}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4 flex flex-col justify-center">
            <div className="bg-nomad-900/50 p-5 rounded-lg border border-nomad-700/50 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="text-nomad-200 text-sm font-bold">Visual Pattern</h4>
              </div>
              <p className="text-nomad-400 text-sm leading-relaxed">
                Nick Sleep looked for <span className="text-white font-medium">Revenue (Bars)</span> growing while <span className="text-yellow-500 font-medium">Margins (Line)</span> stayed flat or declined. This suggests the company is "sharing" economies of scale with the customer to widen the moat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Moat Analysis */}
        <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-nomad-700 pb-4">
             <h2 className="text-2xl font-serif text-nomad-50">Moat Analysis</h2>
             <span className={`text-sm font-bold px-3 py-1 rounded border uppercase tracking-wider ${getVerdictColor(analysis.moatVerdict)}`}>
               {analysis.moatVerdict} Moat
             </span>
          </div>
          
          <div className="mb-6">
            <span className="text-nomad-500 text-xs uppercase tracking-wider font-semibold">Primary Source</span>
            <div className="text-xl text-nomad-200 font-serif mt-1">{analysis.moatSource}</div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-nomad-300 leading-relaxed text-sm border-l-2 border-nomad-700 pl-4">
              {analysis.moatDescription}
            </p>
          </div>
        </div>

        {/* Robustness Ratio (Nick Sleep) */}
        <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-nomad-700 pb-4">
             <h2 className="text-2xl font-serif text-nomad-50">Robustness Ratio</h2>
             <div className="flex items-center gap-2">
               <span className="text-nomad-400 text-xs uppercase font-semibold">Score</span>
               <div className={`text-xl font-bold px-3 py-1 rounded border flex items-center gap-1 ${
                 analysis.robustnessScore >= 8 ? 'bg-green-900/30 text-green-400 border-green-800/50' :
                 analysis.robustnessScore >= 5 ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50' :
                 'bg-red-900/30 text-red-400 border-red-800/50'
               }`}>
                 <span>{analysis.robustnessScore}</span>
                 <span className="text-xs opacity-70 font-normal">/10</span>
               </div>
             </div>
          </div>

          <div className="prose prose-invert max-w-none flex-1 flex flex-col">
             <p className="text-yellow-100/80 leading-relaxed text-sm mb-6 italic bg-yellow-900/10 p-4 rounded border border-yellow-900/20">
              "{analysis.scaleEconomicsShared}"
            </p>
            <div className="mt-auto">
              <h3 className="text-xs font-bold text-nomad-500 uppercase mb-2 tracking-wider">Executive Summary</h3>
              <p className="text-nomad-300 leading-relaxed text-sm">{analysis.summary}</p>
            </div>
          </div>
        </div>

      </div>

      {analysis.sources.length > 0 && (
        <div className="bg-nomad-900/50 rounded-lg p-4 border border-nomad-800 flex items-center gap-4">
           <h4 className="text-[10px] uppercase text-nomad-500 font-bold whitespace-nowrap">Sources Used:</h4>
           <div className="flex flex-wrap gap-2">
             {analysis.sources.map((source, idx) => (
               <a 
                 key={idx} 
                 href={source.uri} 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-[10px] text-nomad-400 hover:text-yellow-400 bg-nomad-800 hover:bg-nomad-700 py-1 px-2 rounded border border-nomad-700 transition-colors flex items-center gap-1"
               >
                 <span>🔗</span>
                 <span className="truncate max-w-[150px]">{source.title || new URL(source.uri).hostname}</span>
               </a>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MoatAnalyzer;
