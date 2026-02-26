
import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

const ManagementAnalysis: React.FC<Props> = ({ analysis }) => {
  const mgmt = analysis.managementAnalysis;

  if (!mgmt) return null;

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('fanatical') || v.includes('long-term')) return 'text-green-400 border-green-800/50 bg-green-900/20';
    if (v.includes('standard')) return 'text-yellow-400 border-yellow-800/50 bg-yellow-900/20';
    return 'text-red-400 border-red-800/50 bg-red-900/20';
  };

  return (
    <div className="bg-nomad-800 rounded-xl border border-nomad-700 shadow-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-nomad-700 bg-nomad-900/40 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-nomad-700 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-nomad-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.946 5.946 0 00-.94 3.198l.001.031m12 0a5.969 5.969 0 01-1.262 3.522 9.969 9.969 0 01-4.738 3.522m-4.738-3.522a9.969 9.969 0 01-1.262-3.522m12-13.5a3 3 0 11-6 0 3 3 0 016 0zm-1.94 13.5a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif text-nomad-50">Management Quality</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${getVerdictColor(mgmt.verdict)}`}>
          {mgmt.verdict}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`h-6 w-2 rounded-sm ${i < mgmt.score ? 'bg-yellow-500' : 'bg-nomad-700'}`}
              />
            ))}
          </div>
          <div className="text-2xl font-mono text-yellow-500">{mgmt.score}<span className="text-xs text-nomad-500">/10</span></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {mgmt.traits.map((trait, idx) => (
            <span key={idx} className="bg-nomad-900 text-nomad-300 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border border-nomad-700">
              {trait}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none flex-1">
          <p className="text-nomad-300 text-sm leading-relaxed italic border-l-2 border-nomad-700 pl-4">
            {mgmt.details}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-nomad-700/50">
          <p className="text-[10px] text-nomad-500 uppercase tracking-widest font-bold mb-2">Nomad Criteria</p>
          <div className="grid grid-cols-2 gap-4 text-[10px] text-nomad-400">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Long-term Horizon
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> High Integrity
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Capital Allocation
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Customer Focused
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementAnalysis;
