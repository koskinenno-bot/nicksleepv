
import React, { useState, useMemo, useEffect } from 'react';
import { CompanyData } from '../types';
import { calculateIntrinsicValue, findImpliedGrowth, calculateScenarioCAGR } from '../utils/math';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import OwnersEarningsCalculator from './OwnersEarningsCalculator';

interface Props {
  company: CompanyData;
}

const ValuationTool: React.FC<Props> = ({ company }) => {
  const [discountRate, setDiscountRate] = useState(0.10); // 10% default per Sleep
  const [terminalMultiple, setTerminalMultiple] = useState(15);
  const [holdingPeriod, setHoldingPeriod] = useState(5); // 5 years per quote
  const [ownersEarnings, setOwnersEarnings] = useState(company.fcfPerShare);
  const [showCalculator, setShowCalculator] = useState(false);

  // Reset state when company changes
  useEffect(() => {
    setOwnersEarnings(company.fcfPerShare);
    setShowCalculator(false);
  }, [company]);
  
  // Use Owner's Earnings (FCF) as the base metric
  // Handle division by zero if ownersEarnings is 0
  const currentMultiple = ownersEarnings !== 0 ? company.price / ownersEarnings : 0;

  // Determine max value for the slider
  const sliderMax = useMemo(() => {
    const base = Math.max(Math.abs(company.eps || 0), Math.abs(company.fcfPerShare || 0), 1);
    return Math.ceil(base * 3);
  }, [company]);

  // Calculate implied growth based on current price (Reverse DCF)
  const impliedGrowth = useMemo(() => 
    findImpliedGrowth(company.price, ownersEarnings, discountRate, 10, terminalMultiple),
    [company.price, ownersEarnings, discountRate, terminalMultiple]
  );

  // Generate sensitivity data for the chart (Price vs Growth)
  const chartData = useMemo(() => {
    const data = [];
    // Handle NaN if impliedGrowth failed (e.g. negative owners earnings)
    const safeImpliedGrowth = isNaN(impliedGrowth) ? 0 : impliedGrowth;
    
    const centerGrowth = Math.round(safeImpliedGrowth * 100);
    const start = Math.max(-50, centerGrowth - 15); // Allow wider negative range
    const end = centerGrowth + 15;

    for (let i = start; i <= end; i++) {
      const g = i / 100;
      const val = calculateIntrinsicValue(ownersEarnings, g, discountRate, 10, terminalMultiple);
      data.push({
        growth: i,
        price: val,
        isImplied: i === centerGrowth
      });
    }
    return data;
  }, [impliedGrowth, ownersEarnings, discountRate, terminalMultiple]);

  // Returns Matrix Calculation
  const matrixData = useMemo(() => {
    const growthRates = [0, 0.05, 0.10, 0.15, 0.20, 0.25];
    const exitMultiples = [10, 15, 20, 25, 30, 40];
    
    return exitMultiples.map(mult => ({
      multiple: mult,
      returns: growthRates.map(growth => ({
        growth,
        cagr: calculateScenarioCAGR(company.price, ownersEarnings, growth, mult, holdingPeriod)
      }))
    })).reverse(); // Higher multiples on top
  }, [company.price, ownersEarnings, holdingPeriod]);

  const growthRatesHeader = [0, 0.05, 0.10, 0.15, 0.20, 0.25];

  // Nick Sleep logic text
  const sleepVerdict = useMemo(() => {
    if (ownersEarnings <= 0) return "Owner's Earnings must be positive to imply a growth rate in this model.";
    
    const percent = (impliedGrowth * 100).toFixed(1);
    if (impliedGrowth < 0.06) return `At ${percent}%, the market is pricing in modest growth. "If the moat is wide, this is a bargain."`;
    if (impliedGrowth < 0.12) return `At ${percent}%, the price demands solid execution. "Typical for high quality compounders."`;
    return `At ${percent}%, the market expects exceptional growth. "The moat must be widening rapidly to justify this."`;
  }, [impliedGrowth, ownersEarnings]);

  const getCellColor = (cagr: number) => {
    if (cagr >= 0.20) return 'bg-green-900/40 text-green-400 border-green-800/30 font-medium';
    if (cagr >= 0.10) return 'bg-yellow-900/20 text-yellow-500 border-yellow-800/30';
    if (cagr >= 0.0) return 'bg-nomad-800 text-nomad-400 border-nomad-700';
    return 'bg-red-900/20 text-red-400 border-red-800/30';
  };

  const handleApplyOwnersEarnings = (value: number) => {
    setOwnersEarnings(value);
    setShowCalculator(false);
  };

  return (
    <div className="bg-nomad-800 rounded-xl border border-nomad-700 shadow-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-nomad-700 bg-gradient-to-r from-nomad-800 to-nomad-900">
        <h2 className="text-2xl font-serif text-nomad-50 tracking-tight">
          Valuation & Returns
        </h2>
        <p className="text-nomad-400 text-sm mt-2">
          Based on Owner's Earnings (FCF), inspired by Nomad Investment Partnership.
        </p>
      </div>
      
      <div className="p-6 md:p-8 space-y-10 bg-nomad-900/50">
        
        {/* Calculator Toggle */}
        {showCalculator && (
          <OwnersEarningsCalculator 
            company={company} 
            onApply={handleApplyOwnersEarnings} 
            onClose={() => setShowCalculator(false)} 
          />
        )}

        {/* Top Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
           {/* Owner's Earnings Slider */}
           <div className="bg-nomad-800 p-5 rounded-lg border border-nomad-700 flex flex-col shadow-md">
             <div className="flex justify-between items-center mb-3">
                <label className="block text-nomad-400 text-xs uppercase tracking-wider font-semibold">Owner's Earnings</label>
                <button 
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-[10px] text-yellow-500 hover:text-yellow-300 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-700/30 transition-colors uppercase tracking-wide font-medium"
                >
                  {showCalculator ? 'Hide Calc' : 'Buffett Calc'}
                </button>
             </div>
             <div className="flex flex-col gap-2 flex-1 justify-center">
               <div className="relative w-full group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600 font-mono text-lg transition-colors group-focus-within:text-yellow-500">$</span>
                  <input
                    type="number"
                    value={ownersEarnings}
                    onChange={e => setOwnersEarnings(parseFloat(e.target.value) || 0)}
                    className="w-full bg-nomad-900 border border-nomad-600 rounded-lg pl-8 pr-3 py-2 text-right text-yellow-400 font-mono text-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                    step="0.01"
                  />
               </div>
               <input 
                 type="range" min="0.1" max={sliderMax} step="0.1" 
                 value={ownersEarnings} onChange={e => setOwnersEarnings(parseFloat(e.target.value))}
                 className="w-full accent-yellow-500 h-1.5 bg-nomad-700 rounded-lg appearance-none cursor-pointer mt-2"
               />
             </div>
           </div>

           {/* Discount Rate */}
           <div className="bg-nomad-800 p-5 rounded-lg border border-nomad-700 flex flex-col shadow-md">
             <label className="block text-nomad-400 text-xs uppercase tracking-wider font-semibold mb-3">Discount Rate</label>
             <div className="flex flex-col gap-2 flex-1 justify-center">
               <div className="relative w-full group">
                  <input
                    type="number"
                    value={Math.round(discountRate * 100)}
                    onChange={e => setDiscountRate((parseFloat(e.target.value) || 0) / 100)}
                    className="w-full bg-nomad-900 border border-nomad-600 rounded-lg pl-3 pr-8 py-2 text-right text-nomad-200 font-mono text-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-nomad-500 font-mono text-lg group-focus-within:text-yellow-500">%</span>
               </div>
               <input 
                 type="range" min="0.06" max="0.20" step="0.01" 
                 value={discountRate} onChange={e => setDiscountRate(parseFloat(e.target.value))}
                 className="w-full accent-yellow-500 h-1.5 bg-nomad-700 rounded-lg appearance-none cursor-pointer mt-2"
               />
             </div>
           </div>
           
           {/* Holding Period */}
           <div className="bg-nomad-800 p-5 rounded-lg border border-nomad-700 flex flex-col shadow-md">
             <label className="block text-nomad-400 text-xs uppercase tracking-wider font-semibold mb-3">Holding Period</label>
             <div className="flex flex-col gap-2 flex-1 justify-center">
               <div className="relative w-full group">
                  <input
                    type="number"
                    value={holdingPeriod}
                    onChange={e => setHoldingPeriod(parseFloat(e.target.value) || 0)}
                    className="w-full bg-nomad-900 border border-nomad-600 rounded-lg pl-3 pr-10 py-2 text-right text-nomad-200 font-mono text-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-nomad-500 font-mono text-lg group-focus-within:text-yellow-500">yr</span>
               </div>
               <input 
                 type="range" min="1" max="30" step="1" 
                 value={holdingPeriod} onChange={e => setHoldingPeriod(parseFloat(e.target.value))}
                 className="w-full accent-yellow-500 h-1.5 bg-nomad-700 rounded-lg appearance-none cursor-pointer mt-2"
               />
             </div>
           </div>

           {/* Multiple Display */}
           <div className="bg-nomad-800 p-5 rounded-lg border border-nomad-700 flex flex-col justify-center shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 bg-white/5 rounded-full blur-xl -mr-4 -mt-4"></div>
             <div className="flex justify-between items-baseline mb-2 relative z-10">
               <div className="text-nomad-400 text-xs uppercase tracking-wider font-semibold">Current P/OE</div>
             </div>
             <div className="text-3xl text-white font-mono text-right relative z-10 tracking-tight">
               {isFinite(currentMultiple) ? currentMultiple.toFixed(1) : 'N/A'}x
             </div>
             <div className="text-[10px] text-nomad-500 text-right relative z-10 mt-1">Price / Owner's Earnings</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Reverse DCF */}
          <div className="space-y-6">
             <div className="flex items-baseline justify-between border-b border-nomad-700 pb-2">
                <h3 className="text-lg font-medium text-nomad-200">Market Expectations</h3>
                <span className="text-xs text-nomad-500 uppercase tracking-wide">Reverse DCF Model</span>
             </div>
             
             <div className="bg-nomad-800/50 rounded-lg p-6 border border-nomad-700 shadow-inner">
               <div className="flex justify-between items-end mb-4">
                 <span className="text-nomad-400 text-sm font-medium">Implied Growth Rate</span>
                 <span className="text-4xl text-yellow-500 font-serif tracking-tight">
                    {isNaN(impliedGrowth) ? "N/A" : `${(impliedGrowth * 100).toFixed(1)}%`}
                 </span>
               </div>
               <p className="text-nomad-300 italic text-sm border-l-2 border-yellow-600 pl-4 py-1">
                 {sleepVerdict}
               </p>
             </div>

             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                   <XAxis dataKey="growth" hide />
                   <YAxis domain={['auto', 'auto']} hide />
                   <Tooltip 
                     cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }}
                     contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0', fontSize: '12px', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                     formatter={(value: number) => [`$${value.toFixed(2)}`, 'Intrinsic Value']}
                     labelFormatter={(label) => `Growth: ${label}%`}
                   />
                   <ReferenceLine y={company.price} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'Current Price', fill: '#eab308', fontSize: 10, position: 'insideTopLeft' }} />
                   <Line type="monotone" dataKey="price" stroke="#94a3b8" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#eab308', stroke: '#fff' }} />
                 </LineChart>
               </ResponsiveContainer>
               <p className="text-center text-[10px] text-nomad-500 uppercase tracking-widest mt-2">Price Sensitivity Curve</p>
             </div>
          </div>

          {/* Right: Returns Matrix */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1 border-b border-nomad-700 pb-2">
              <div className="flex justify-between items-baseline">
                 <h3 className="text-lg font-medium text-nomad-200">Returns Matrix</h3>
                 <span className="text-xs text-nomad-500 uppercase tracking-wide">{holdingPeriod}YR CAGR</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-nomad-700 shadow-lg">
              <table className="w-full text-center text-sm border-collapse">
                <thead className="bg-nomad-800">
                  <tr>
                    <th className="p-3 text-nomad-500 font-normal text-[10px] uppercase tracking-wider border-b border-nomad-700 border-r">Exit P/OE</th>
                    {growthRatesHeader.map(g => (
                      <th key={g} className="p-2 text-nomad-300 font-medium border-b border-nomad-700 text-xs">
                        {(g * 100).toFixed(0)}%
                        <span className="block text-[9px] text-nomad-500 font-normal uppercase">Growth</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-nomad-900/30">
                  {matrixData.map((row, i) => (
                    <tr key={row.multiple}>
                      <td className="p-2 text-nomad-400 font-mono text-xs border-r border-nomad-700/50 bg-nomad-800/50">
                        {row.multiple}x
                      </td>
                      {row.returns.map((cell, j) => (
                        <td key={j} className="p-1 border-b border-nomad-700/30">
                          <div className={`w-full py-2 rounded text-xs transition-all hover:scale-105 cursor-default ${getCellColor(cell.cagr)}`}>
                             {(cell.cagr * 100).toFixed(1)}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-nomad-800/50 p-4 rounded-lg text-xs text-nomad-400 border border-nomad-700/50 flex items-start gap-3">
               <div className="mt-0.5 text-yellow-500">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                 </svg>
               </div>
               <p>
                 <strong className="text-nomad-200">Scenario:</strong> If {company.ticker} grows Owner's Earnings at <span className="text-white">15%</span> and trades at <span className="text-white">25x</span> in {holdingPeriod} years, your annual return is <span className="text-yellow-500 font-bold">{(calculateScenarioCAGR(company.price, ownersEarnings, 0.15, 25, holdingPeriod)*100).toFixed(1)}%</span>.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ValuationTool;