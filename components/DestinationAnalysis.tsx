
import React, { useState, useMemo } from 'react';
import { CompanyData } from '../types';
import { calculateScenarioCAGR } from '../utils/math';

interface Props {
  company: CompanyData;
}

const DestinationAnalysis: React.FC<Props> = ({ company }) => {
  // Nick Sleep's Destination Analysis focuses on the 10-year end state
  const [revGrowth, setRevGrowth] = useState(0.15); // 15% CAGR
  const [targetMargin, setTargetMargin] = useState(company.financials?.[0]?.netMargin || 15);
  const [targetMultiple, setTargetMultiple] = useState(20);
  const [shareReduction, setShareReduction] = useState(0.01); // 1% annual buyback
  const [years, setYears] = useState(10);
  
  // Manual Revenue Override
  const initialRev = company.financials?.[company.financials.length - 1]?.revenue || 10;
  const [currentRev, setCurrentRev] = useState(initialRev);

  // Update currentRev when company changes
  React.useEffect(() => {
    setCurrentRev(initialRev);
  }, [initialRev]);

  const currentShares = company.sharesOutstanding || 1;

  const results = useMemo(() => {
    const futureRev = currentRev * Math.pow(1 + revGrowth, years);
    const futureNetIncome = futureRev * (targetMargin / 100);
    const futureShares = currentShares * Math.pow(1 - shareReduction, years);
    const futureEPS = futureNetIncome / futureShares;
    const futurePrice = futureEPS * targetMultiple;
    
    const irr = Math.pow(futurePrice / company.price, 1 / years) - 1;

    return {
      futureRev,
      futureNetIncome,
      futureEPS,
      futurePrice,
      irr
    };
  }, [currentRev, revGrowth, targetMargin, targetMultiple, shareReduction, years, currentShares, company.price]);

  return (
    <div className="bg-nomad-800 rounded-xl border border-nomad-700 shadow-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-nomad-700 bg-gradient-to-br from-nomad-800 to-nomad-950">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.966 14.966 0 01-5.96 5.96m0 0L2.25 21l.81-4.738a9.969 9.969 0 011.09-4.513 9.969 9.969 0 015.96-5.96L9.63 8.41" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-nomad-50 tracking-tight">Destination Analysis</h2>
        </div>
        <p className="text-nomad-400 text-sm max-w-2xl">
          "The best businesses are those that can grow for a long time. We try to imagine what the company looks like in 10 years and work back." — Nick Sleep
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-6">
            
            {/* Current Revenue Input */}
            <div className="bg-nomad-900/40 p-4 rounded-lg border border-nomad-700/50 group focus-within:border-yellow-500/50 transition-colors">
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-nomad-500 font-bold">Current Revenue ($B)</label>
                <span className="text-[10px] text-nomad-600 font-mono">Manual Entry</span>
              </div>
              <div className="flex items-center">
                <span className="text-nomad-600 mr-2 font-mono text-lg">$</span>
                <input 
                  type="number" 
                  value={currentRev} 
                  onChange={e => setCurrentRev(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-xl text-nomad-100 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-nomad-500 font-bold">Revenue Growth (CAGR)</label>
                <span className="text-yellow-500 font-mono">{(revGrowth * 100).toFixed(1)}%</span>
              </div>
              <input 
                type="range" min="0" max="0.5" step="0.01" value={revGrowth}
                onChange={e => setRevGrowth(parseFloat(e.target.value))}
                className="w-full accent-yellow-500 h-1.5 bg-nomad-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="group">
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-nomad-500 font-bold">Target Net Margin</label>
                <span className="text-yellow-500 font-mono">{targetMargin.toFixed(1)}%</span>
              </div>
              <input 
                type="range" min="1" max="50" step="0.5" value={targetMargin}
                onChange={e => setTargetMargin(parseFloat(e.target.value))}
                className="w-full accent-yellow-500 h-1.5 bg-nomad-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="group">
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-nomad-500 font-bold">Target Exit P/E</label>
                <span className="text-yellow-500 font-mono">{targetMultiple}x</span>
              </div>
              <input 
                type="range" min="5" max="60" step="1" value={targetMultiple}
                onChange={e => setTargetMultiple(parseInt(e.target.value))}
                className="w-full accent-yellow-500 h-1.5 bg-nomad-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="group">
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-nomad-500 font-bold">Annual Share Reduction</label>
                <span className="text-yellow-500 font-mono">{(shareReduction * 100).toFixed(1)}%</span>
              </div>
              <input 
                type="range" min="-0.05" max="0.1" step="0.005" value={shareReduction}
                onChange={e => setShareReduction(parseFloat(e.target.value))}
                className="w-full accent-yellow-500 h-1.5 bg-nomad-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-nomad-900/50 p-4 rounded-lg border border-nomad-700/50">
            <h4 className="text-[10px] uppercase text-nomad-500 font-bold mb-2 tracking-widest">Nomad Insight</h4>
            <p className="text-xs text-nomad-400 leading-relaxed italic">
              "We are looking for businesses that can grow their intrinsic value at high rates for a long time. The destination is more important than the path."
            </p>
          </div>
        </div>

        {/* Right: Results Display */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-nomad-800 p-5 rounded-xl border border-nomad-700 shadow-inner">
              <span className="text-[10px] uppercase text-nomad-500 font-bold tracking-widest">Future Revenue</span>
              <div className="text-2xl text-white font-serif mt-1">${results.futureRev.toFixed(1)}B</div>
              <div className="text-[10px] text-nomad-500 mt-1">In {years} Years</div>
            </div>
            <div className="bg-nomad-800 p-5 rounded-xl border border-nomad-700 shadow-inner">
              <span className="text-[10px] uppercase text-nomad-500 font-bold tracking-widest">Future Net Income</span>
              <div className="text-2xl text-white font-serif mt-1">${results.futureNetIncome.toFixed(1)}B</div>
              <div className="text-[10px] text-nomad-500 mt-1">At {targetMargin}% Margin</div>
            </div>
          </div>

          <div className="flex-1 bg-nomad-900/80 rounded-2xl border border-yellow-500/20 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <span className="text-xs uppercase text-nomad-500 font-bold tracking-[0.2em] mb-4">Implied Annual Return (IRR)</span>
            <div className={`text-7xl font-serif tracking-tighter ${results.irr >= 0.15 ? 'text-green-400' : results.irr >= 0.10 ? 'text-yellow-500' : 'text-red-400'}`}>
              {(results.irr * 100).toFixed(1)}%
            </div>
            
            <div className="mt-8 grid grid-cols-2 w-full gap-8 border-t border-nomad-800 pt-8">
              <div className="text-center">
                <span className="text-[10px] uppercase text-nomad-500 font-bold tracking-widest block mb-1">Future EPS</span>
                <span className="text-xl text-nomad-100 font-mono">${results.futureEPS.toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase text-nomad-500 font-bold tracking-widest block mb-1">Future Price</span>
                <span className="text-xl text-nomad-100 font-mono">${results.futurePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-nomad-500">
              Current Price: <span className="text-nomad-300 font-mono">${company.price.toFixed(2)}</span> • 
              Exit Multiple: <span className="text-nomad-300 font-mono">{targetMultiple}x</span> • 
              Horizon: <span className="text-nomad-300 font-mono">{years} Years</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationAnalysis;
