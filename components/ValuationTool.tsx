
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
    if (cagr >= 0.20) return 'bg-green-900/40 text-green-400 border-green-800/30';
    if (cagr >= 0.10) return 'bg-yellow-900/20 text-yellow-500 border-yellow-800/30';
    if (cagr >= 0.0) return 'bg-nomad-800 text-nomad-400 border-nomad-700';
    return 'bg-red-900/20 text-red-400 border-red-800/30';
  };

  const handleApplyOwnersEarnings = (value: number) => {
    setOwnersEarnings(value);
    setShowCalculator(false);
  };

  return (
    <div className="bg-nomad-800 rounded-xl border border-nomad-700 shadow-xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-nomad-700">
        <h2 className="text-2xl font-serif text-nomad-100">
          Valuation & Returns
        </h2>
        <p className="text-nomad-400 text-sm mt-2">
          Based on Owner's Earnings (FCF), inspired by Nomad Investment Partnership.
        </p>
      </div>
      
      <div className="p-6 md:p-8 space-y-10">
        
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
           <div className="bg-nomad-900/50 p-4 rounded-lg border border-nomad-700 flex flex-col">
             <div className="flex justify-between items-center mb-3">
                <label className="block text-nomad-400 text-xs uppercase tracking-wider">Owner's Earnings</label>
                <button 
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-[10px] text-yellow-500 hover:text-yellow-400 bg-nomad-800 px-2 py-0.5 rounded border border-yellow-900/50 transition-colors"
                >
                  {showCalculator ? 'Hide Calc' : 'Buffett Calc'}
                </button>
             </div>
             <div className="flex flex-col gap-2 flex-1 justify-center">
               <div className="relative w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600/70 font-mono text-lg">$</span>
                  <input
                    type="number"
                    value={ownersEarnings}
                    onChange={e => setOwnersEarnings(parseFloat(e.target.value) || 0)}
                    className="w-full bg-nomad-800 border border-nomad-600 rounded-lg pl-10 pr-4 py-3 text-right text-yellow-500 font-mono text-xl focus:outline-none focus:border-yellow-600"
                    step="0.01"
                  />
               </div>
               <input 
                 type="range" min="0.1" max={sliderMax} step="0.1" 
                 value={ownersEarnings} onChange={e => setOwnersEarnings(parseFloat(e.target.value))}
                 className="w-full accent-yellow-600 h-2 bg-nomad-700 rounded-lg appearance-none cursor-pointer mt-2"
               />
             </div>
           </div>

           {/* Discount Rate */}
           <div className="bg-nomad-900/50 p-4 rounded-lg border border-nomad-700 flex flex-col">
             <label className="block text-nomad-400 text-xs uppercase tracking-wider mb-3">Discount Rate (Reverse DCF)</label>
             <div className="flex flex-col gap-2 flex-1 justify-center">
               <div className="relative w-full">
                  <input
                    type="number"
                    value={Math.round(discountRate * 100)}
                    onChange={e => setDiscountRate((parseFloat(e.target.value) || 0) / 100)}
                    className="w-full bg-nomad-800 border border-nomad-600 rounded-lg pl-4 pr-10 py-3 text-right text-nomad-200 font-mono text-xl focus:outline-none focus:border-yellow-600"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-nomad-500 font-mono text-lg">%</span>
               </div>
               <input 
                 type="range" min="0.06" max="0.20" step="0.01" 
                 value={discountRate} onChange={e => setDiscountRate(parseFloat(e.target.value))}
                 className="w-full accent-yellow-600 h-2 bg-nomad-700 rounded-lg appearance-none cursor-pointer mt-2"
               />
             </div>
           </div>
           
           {/* Holding Period */}
           <div className="bg-nomad-900/50 p-4 rounded-lg border border-nomad-700 flex flex-col">
             <label className="block text-nomad-400 text-xs uppercase tracking-wider mb-3">Holding Period (Matrix)</label>
             <div className="flex flex-col gap-2 flex-1 justify-center">
               <div className="relative w-full">
                  <input
                    type="number"
                    value={holdingPeriod}
                    onChange={e => setHoldingPeriod(parseFloat(e.target.value) || 0)}
                    className="w-full bg-nomad-800 border border-nomad-600 rounded-lg pl-4 pr-10 py-3 text-right text-nomad-200 font-mono text-xl focus:outline-none focus:border-yellow-600"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-nomad-500 font-mono text-lg">yr</span>
               </div>
               <input 
                 type="range" min="1" max="30" step="1" 
                 value={holdingPeriod} onChange={e => setHoldingPeriod(parseFloat(e.target.value))}
                 className="w-full accent-yellow-600 h-2 bg-nomad-700 rounded-lg appearance-none cursor-pointer mt-2"
               />
             </div>
           </div>

           {/* Multiple Display */}
           <div className="bg-nomad-900/50 p-4 rounded-lg border border-nomad-700 flex flex-col justify-center">
             <div className="flex justify-between items-baseline mb-2">
               <div className="text-nomad-400 text-xs uppercase tracking-wider">Current Multiple</div>
               <div className="text-[10px] text-nomad-500">Price / OE</div>
             </div>
             <div className="text-3xl text-white font-mono text-right">{isFinite(currentMultiple) ? currentMultiple.toFixed(1) : 'N/A'}x</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Reverse DCF */}
          <div className="space-y-6">
             <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-medium text-nomad-200">Market Expectations</h3>
                <span className="text-xs text-nomad-500">Reverse DCF Model</span>
             </div>
             
             <div className="bg-nomad-900/30 rounded-lg p-6 border border-nomad-700/50">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-nomad-400 text-sm">Implied Growth Rate</span>
                 <span className="text-3xl text-yellow-500 font-serif">
                    {isNaN(impliedGrowth) ? "N/A" : `${(impliedGrowth * 100).toFixed(1)}%`}
                 </span>
               </div>
               <p className="text-nomad-300 italic text-sm border-l-2 border-yellow-600/50 pl-3 mt-4">
                 {sleepVerdict}
               </p>
             </div>

             <div className="h-48 w-full opacity-80 hover:opacity-100 transition-opacity">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#3a4642" vertical={false} />
                   <XAxis dataKey="growth" hide />
                   <YAxis domain={['auto', 'auto']} hide />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #455651', color: '#e3e8e6', fontSize: '12px' }}
                     formatter={(value: number) => [`$${value.toFixed(2)}`, 'Intrinsic Value']}
                     labelFormatter={(label) => `Growth: ${label}%`}
                   />
                   <ReferenceLine y={company.price} stroke="#eab308" strokeDasharray="3 3" />
                   <Line type="monotone" dataKey="price" stroke="#9bada6" strokeWidth={2} dot={false} />
                 </LineChart>
               </ResponsiveContainer>
               <p className="text-center text-[10px] text-nomad-500 uppercase tracking-widest mt-2">Price Sensitivity Curve</p>
             </div>
          </div>

          {/* Right: Returns Matrix */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-medium text-nomad-200">Investment Returns Matrix</h3>
              <p className="text-xs text-nomad-400">
                Annualized Stock Price Return (CAGR) over {holdingPeriod} years if convergence occurs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-nomad-500 font-normal text-xs border-b border-nomad-700/50">Exit P/OE</th>
                    {growthRatesHeader.map(g => (
                      <th key={g} className="p-2 text-nomad-300 font-medium border-b border-nomad-700/50">
                        {(g * 100).toFixed(0)}%
                        <span className="block text-[10px] text-nomad-600 font-normal">Growth</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixData.map((row, i) => (
                    <tr key={row.multiple}>
                      <td className="p-2 text-nomad-400 font-mono border-r border-nomad-700/50 bg-nomad-900/20">
                        {row.multiple}x
                      </td>
                      {row.returns.map((cell, j) => (
                        <td key={j} className="p-1">
                          <div className={`w-full h-full py-2 rounded border ${getCellColor(cell.cagr)}`}>
                             {(cell.cagr * 100).toFixed(1)}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-nomad-900/30 p-4 rounded text-xs text-nomad-400 border border-nomad-800">
               <strong className="text-nomad-300">How to read:</strong> If {company.ticker} grows Owner's Earnings at <span className="text-white">15%</span> and trades at <span className="text-white">25x</span> P/OE in {holdingPeriod} years, your annual return is <span className="text-yellow-500">{(calculateScenarioCAGR(company.price, ownersEarnings, 0.15, 25, holdingPeriod)*100).toFixed(1)}%</span>.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ValuationTool;
