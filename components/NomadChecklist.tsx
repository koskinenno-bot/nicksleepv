
import React from 'react';
import { AnalysisResult, CompanyData } from '../types';

interface Props {
  company: CompanyData;
  analysis: AnalysisResult;
}

const NomadChecklist: React.FC<Props> = ({ company, analysis }) => {
  const checks = [
    {
      label: "Moat Widening",
      status: analysis.robustnessScore >= 7 ? "Positive" : analysis.robustnessScore >= 5 ? "Neutral" : "Negative",
      description: analysis.robustnessScore >= 7 
        ? "The robustness ratio suggests a widening competitive advantage." 
        : "The moat may be static or under pressure from competitors."
    },
    {
      label: "Management Quality",
      status: analysis.managementAnalysis?.score && analysis.managementAnalysis.score >= 8 ? "Positive" : "Neutral",
      description: analysis.managementAnalysis?.verdict === "Fanatical" 
        ? "Management shows 'fanatical' long-term orientation." 
        : "Management appears standard or corporate in their approach."
    },
    {
      label: "Scale Economics Shared",
      status: analysis.scaleEconomicsShared.toLowerCase().includes("share") ? "Positive" : "Neutral",
      description: "Evidence of cost savings being passed back to customers to drive volume."
    },
    {
      label: "Capital Allocation",
      status: analysis.capitalAllocation && analysis.capitalAllocation.length > 0 && 
              analysis.capitalAllocation[analysis.capitalAllocation.length-1].reinvestment > 
              analysis.capitalAllocation[analysis.capitalAllocation.length-1].payout ? "Positive" : "Neutral",
      description: "Company is prioritizing reinvestment over immediate harvesting."
    },
    {
      label: "The Destination",
      status: "Analysis",
      description: "Does the 10-year end-state justify the current market valuation?"
    }
  ];

  return (
    <div className="bg-nomad-800 rounded-xl p-6 md:p-8 border border-nomad-700 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-nomad-700 pb-4">
        <div className="bg-yellow-500/20 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-nomad-50 tracking-tight">Nomad Checklist</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {checks.map((check, idx) => (
          <div key={idx} className="bg-nomad-900/50 p-4 rounded-lg border border-nomad-700/50 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-nomad-200 uppercase tracking-wider">{check.label}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                check.status === "Positive" ? "bg-green-900/30 text-green-400 border-green-800/50" :
                check.status === "Neutral" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800/50" :
                "bg-red-900/30 text-red-400 border-red-800/50"
              }`}>
                {check.status}
              </span>
            </div>
            <p className="text-xs text-nomad-400 leading-relaxed flex-1">
              {check.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NomadChecklist;
