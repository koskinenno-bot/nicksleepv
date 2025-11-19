
import React from 'react';
import { CompanyData, AnalysisResult } from '../types';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface Props {
  company: CompanyData;
  analysis: AnalysisResult;
}

const MoatAnalyzer: React.FC<Props> = ({ company, analysis }) => {
  
  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('wide')) return 'bg-green-900/50 text-green-400 border-green-700';
    if (v.includes('narrow')) return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
    return 'bg-red-900/50 text-red-400 border-red-700';
  };

  return (
    <div className="space-y-8">
      
      {/* Financial Visuals */}
      <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-xl">
         <div className="flex justify-between items-end mb-6 border-b border-nomad-700 pb-4">
            <h2 className="text-2xl font-serif text-nomad-100">
              Scale Economics Shared
            </h2>
            <span className="text-xs text-nomad-400 uppercase tracking-widest">5 Year Trend</span>
         </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 h-80">
             <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={company.financials}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a4642" vertical={false} />
                <XAxis dataKey="year" stroke="#768a82" />
                <YAxis yAxisId="left" stroke="#9bada6" label={{ value: 'Rev ($B)', angle: -90, position: 'insideLeft', fill: '#9bada6' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#eab308" label={{ value: 'Margin %', angle: 90, position: 'insideRight', fill: '#eab308' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #455651' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($B)" fill="#455651" barSize={40} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="netMargin" name="Net Margin %" stroke="#eab308" strokeWidth={3} dot={{r: 4, fill: '#111', strokeWidth: 2}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/3 space-y-4 flex flex-col justify-center">
            <div className="bg-nomad-900/30 p-4 rounded-lg border border-nomad-700/50">
              <h4 className="text-nomad-300 text-sm font-bold mb-2">Visual Pattern to Watch</h4>
              <p className="text-nomad-400 text-sm leading-relaxed">
                Nick Sleep looked for <span className="text-white">Revenue (Bars)</span> growing while <span className="text-yellow-500">Margins (Line)</span> stayed flat or declined. This suggests the company is "sharing" economies of scale with the customer to widen the moat, rather than taking profits today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Moat Analysis */}
        <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-nomad-700 pb-4">
             <h2 className="text-2xl font-serif text-nomad-100">Moat Analysis</h2>
             <span className={`text-sm font-bold px-3 py-1 rounded border uppercase tracking-wider ${getVerdictColor(analysis.moatVerdict)}`}>
               {analysis.moatVerdict} Moat
             </span>
          </div>
          
          <div className="mb-6">
            <span className="text-nomad-500 text-xs uppercase tracking-wider">Primary Source</span>
            <div className="text-xl text-nomad-200 font-serif mt-1">{analysis.moatSource}</div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-nomad-300 leading-relaxed text-sm">
              {analysis.moatDescription}
            </p>
          </div>
        </div>

        {/* Robustness Ratio (Nick Sleep) */}
        <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-nomad-700 pb-4">
             <h2 className="text-2xl font-serif text-nomad-100">Robustness Ratio</h2>
             <div className="flex items-center gap-2">
               <span className="text-nomad-400 text-xs uppercase">Score</span>
               <span className={`text-xl font-bold px-3 py-1 rounded border ${
                 analysis.robustnessScore >= 8 ? 'bg-green-900/50 text-green-400 border-green-700' :
                 analysis.robustnessScore >= 5 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-700' :
                 'bg-red-900/50 text-red-400 border-red-700'
               }`}>
                 {analysis.robustnessScore}/10
               </span>
             </div>
          </div>

          <div className="prose prose-invert max-w-none">
             <p className="text-nomad-300 leading-relaxed text-sm mb-4 italic">
              "{analysis.scaleEconomicsShared}"
            </p>
            <h3 className="text-sm font-bold text-nomad-400 uppercase mt-4 mb-2">Executive Summary</h3>
            <p className="text-nomad-300 leading-relaxed text-sm">{analysis.summary}</p>
          </div>
        </div>

      </div>

      {analysis.sources.length > 0 && (
        <div className="bg-nomad-900/30 rounded-lg p-4 border border-nomad-800">
           <h4 className="text-xs uppercase text-nomad-500 mb-3">Sources Used</h4>
           <div className="flex flex-wrap gap-2">
             {analysis.sources.map((source, idx) => (
               <a 
                 key={idx} 
                 href={source.uri} 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-xs text-nomad-400 hover:text-yellow-500 truncate max-w-[200px] bg-nomad-800 py-1 px-2 rounded border border-nomad-700 transition-colors"
               >
                 {source.title || new URL(source.uri).hostname}
               </a>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MoatAnalyzer;
