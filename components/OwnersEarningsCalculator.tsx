
import React, { useState, useEffect } from 'react';
import { CompanyData } from '../types';

interface Props {
  company: CompanyData;
  onApply: (value: number) => void;
  onClose: () => void;
}

const OwnersEarningsCalculator: React.FC<Props> = ({ company, onApply, onClose }) => {
  // State for inputs (in Billions)
  const [netIncome, setNetIncome] = useState(company.ttmFinancials?.netIncome || 0);
  const [depreciation, setDepreciation] = useState(company.ttmFinancials?.depreciation || 0);
  const [sbc, setSbc] = useState(company.ttmFinancials?.stockBasedCompensation || 0);
  const [capex, setCapex] = useState(company.ttmFinancials?.capitalExpenditures || 0);
  const [workingCapital, setWorkingCapital] = useState(company.ttmFinancials?.changeInWorkingCapital || 0);
  const [maintenancePct, setMaintenancePct] = useState(100); // Default to 100% of CapEx
  const [shares, setShares] = useState(company.sharesOutstanding || 1);

  // Derived values
  const maintenanceCapex = (capex * (maintenancePct / 100));
  
  // Intermediate: Cash Flow from Operations (Approx)
  // We add SBC back to show the standard Cash Flow number first
  const cashFlowFromOps = netIncome + depreciation + sbc + workingCapital;

  // Owner's Earnings Calculation
  // Subtract SBC again because we treat it as a real expense (dilution)
  const ownersEarningsTotal = cashFlowFromOps - maintenanceCapex - sbc;
  
  const ownersEarningsPerShare = shares > 0 ? ownersEarningsTotal / shares : 0;

  return (
    <div className="bg-nomad-900/90 backdrop-blur-md border border-yellow-500/30 rounded-xl p-6 mb-8 relative animate-in fade-in slide-in-from-top-4 shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-nomad-500 hover:text-nomad-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-8 border-b border-nomad-700/50 pb-4">
        <h3 className="text-xl font-serif text-yellow-500 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Owner's Earnings Calculator
        </h3>
        <p className="text-nomad-400 text-sm">
          Adjusting GAAP earnings to reflect true cash available to owners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-nomad-800/50 p-4 rounded-lg border border-nomad-700/50 hover:border-nomad-600 transition-colors group">
              <label className="block text-xs uppercase tracking-wider text-nomad-500 mb-2 group-focus-within:text-yellow-500">Net Income ($B)</label>
              <input 
                type="number" 
                value={netIncome} 
                onChange={(e) => setNetIncome(parseFloat(e.target.value))}
                className="w-full bg-transparent text-xl text-nomad-100 font-mono focus:outline-none" 
              />
            </div>
            <div className="bg-nomad-800/50 p-4 rounded-lg border border-nomad-700/50 hover:border-nomad-600 transition-colors group">
              <label className="block text-xs uppercase tracking-wider text-nomad-500 mb-2 group-focus-within:text-yellow-500">Shares (B)</label>
              <div className="flex items-center">
                <span className="text-nomad-600 mr-2">/</span>
                <input 
                  type="number" 
                  value={shares} 
                  onChange={(e) => setShares(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-nomad-100 font-mono focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-nomad-800/50 p-4 rounded-lg border border-nomad-700/50 hover:border-nomad-600 transition-colors group">
              <label className="block text-xs uppercase tracking-wider text-nomad-500 mb-2 group-focus-within:text-green-500">D&A ($B)</label>
              <div className="flex items-center">
                <span className="text-green-500/70 mr-2">+</span>
                <input 
                  type="number" 
                  value={depreciation} 
                  onChange={(e) => setDepreciation(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-nomad-100 font-mono focus:outline-none" 
                />
              </div>
            </div>
             <div className="bg-nomad-800/50 p-4 rounded-lg border border-nomad-700/50 hover:border-nomad-600 transition-colors group">
              <label className="block text-xs uppercase tracking-wider text-nomad-500 mb-2 group-focus-within:text-green-500">Stock Comp ($B)</label>
              <div className="flex items-center">
                <span className="text-green-500/70 mr-2">+</span>
                <input 
                  type="number" 
                  value={sbc} 
                  onChange={(e) => setSbc(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-nomad-100 font-mono focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-nomad-800/50 p-4 rounded-lg border border-nomad-700/50 hover:border-nomad-600 transition-colors group">
            <label className="block text-xs uppercase tracking-wider text-nomad-500 mb-2 group-focus-within:text-yellow-500">Change in Working Cap ($B)</label>
            <div className="flex items-center">
                <span className="text-nomad-600 mr-2">±</span>
              <input 
                type="number" 
                value={workingCapital} 
                onChange={(e) => setWorkingCapital(parseFloat(e.target.value))}
                className="w-full bg-transparent text-xl text-nomad-100 font-mono focus:outline-none" 
              />
            </div>
          </div>

          <div className="bg-nomad-800/50 p-5 rounded-lg border border-nomad-700/50 hover:border-nomad-600 transition-colors">
            <div className="flex justify-between items-baseline mb-3">
               <label className="block text-xs uppercase tracking-wider text-nomad-500">CapEx ($B)</label>
               <div className="text-xs text-yellow-600 font-medium bg-yellow-900/20 px-2 py-1 rounded">
                 Est. Maintenance: {maintenancePct}%
               </div>
            </div>
            <div className="flex items-center mb-4">
                <span className="text-red-500/70 mr-2">-</span>
                <input 
                  type="number" 
                  value={capex} 
                  onChange={(e) => setCapex(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-nomad-100 font-mono focus:outline-none" 
                />
            </div>
            <input 
               type="range" 
               min="0" 
               max="100" 
               value={maintenancePct} 
               onChange={(e) => setMaintenancePct(Number(e.target.value))}
               className="w-full accent-yellow-500 h-1 bg-nomad-700 rounded-lg appearance-none cursor-pointer"
            />
             <p className="text-[10px] text-nomad-500 mt-2 text-right">
               Total Maintenance CapEx: <span className="text-red-400 font-mono">-${maintenanceCapex.toFixed(2)}B</span>
            </p>
          </div>

        </div>

        {/* Result */}
        <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 bg-nomad-800 rounded-xl border border-nomad-700 shadow-inner p-6 flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-20 bg-yellow-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
               
               <div className="relative z-10 space-y-1 text-xs text-nomad-400 mb-6 font-mono">
                 <div className="flex justify-between p-1 px-2"><span>Net Income</span> <span>${netIncome.toFixed(2)}</span></div>
                 <div className="flex justify-between p-1 px-2 text-green-400/80"><span>+ D&A</span> <span>+${depreciation.toFixed(2)}</span></div>
                 <div className="flex justify-between p-1 px-2 text-green-400/80">
                    <span>+ SBC (Add back)</span> 
                    <span>+${sbc.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between p-1 px-2"><span>± Work. Cap</span> <span>{workingCapital > 0 ? '+' : ''}{workingCapital.toFixed(2)}</span></div>
                 <div className="border-t border-nomad-600 my-1 mx-2"></div>
                 <div className="flex justify-between p-1 px-2 text-nomad-200 font-bold bg-nomad-900/40 rounded"><span>= Cash From Ops</span> <span>${cashFlowFromOps.toFixed(2)}</span></div>
                 <div className="h-2"></div>
                 <div className="flex justify-between p-1 px-2 text-red-400/80"><span>- Maint. CapEx</span> <span>-${maintenanceCapex.toFixed(2)}</span></div>
                 <div className="flex justify-between p-1 px-2 text-red-400/80 font-medium bg-red-900/10 rounded">
                    <span>- SBC (Real Cost)</span> 
                    <span>-${sbc.toFixed(2)}</span>
                 </div>
                 <div className="border-t border-nomad-500 my-2 pt-2 mx-2 flex justify-between text-white font-bold text-sm">
                   <span>Total OE ($B)</span> <span>${ownersEarningsTotal.toFixed(2)}</span>
                 </div>
               </div>

               <div className="text-center relative z-10 mt-4 pt-6 border-t border-nomad-700/50">
                 <div className="text-nomad-500 text-[10px] uppercase tracking-widest mb-2">Owner's Earnings Per Share</div>
                 <div className="text-5xl font-serif text-yellow-500 tracking-tight drop-shadow-lg">
                    <span className="text-2xl align-top opacity-50 mr-1">$</span>
                    {ownersEarningsPerShare.toFixed(2)}
                 </div>
               </div>
            </div>

            <button
                onClick={() => onApply(ownersEarningsPerShare)}
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-nomad-950 font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-yellow-900/20 transform active:scale-[0.98]"
            >
                Use This Value
            </button>
        </div>
      </div>
    </div>
  );
};

export default OwnersEarningsCalculator;