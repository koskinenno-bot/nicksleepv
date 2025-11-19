
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
  const [capex, setCapex] = useState(company.ttmFinancials?.capitalExpenditures || 0);
  const [workingCapital, setWorkingCapital] = useState(company.ttmFinancials?.changeInWorkingCapital || 0);
  const [maintenancePct, setMaintenancePct] = useState(100); // Default to 100% of CapEx
  const [shares, setShares] = useState(company.sharesOutstanding || 1);

  // Derived values
  const maintenanceCapex = (capex * (maintenancePct / 100));
  // Formula: Net Income + D&A +/- Working Capital - Maintenance CapEx
  // Note: Working Capital Change is typically "Use of Cash" (negative) or "Source of Cash" (positive) in CF statements.
  // If the API returns "Change" as typically presented in CF Ops:
  // OCF = NI + D&A + ChangeInWC.
  // So we Add ChangeInWC (if it's negative, it subtracts).
  const ownersEarningsTotal = netIncome + depreciation + workingCapital - maintenanceCapex;
  const ownersEarningsPerShare = shares > 0 ? ownersEarningsTotal / shares : 0;

  return (
    <div className="bg-nomad-900/90 border border-yellow-600/30 rounded-xl p-6 mb-8 relative animate-in fade-in slide-in-from-top-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-nomad-500 hover:text-nomad-300"
      >
        ✕
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-serif text-yellow-500 mb-2">Buffett's Owner's Earnings</h3>
        <p className="text-nomad-400 text-sm italic">
          "Reported earnings plus depreciation, depletion, amortization... less the amount of capital expenditures required to maintain your competitive position." - Warren Buffett, 1986
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Inputs */}
        <div className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-nomad-800/50 p-3 rounded-lg border border-nomad-700">
              <label className="block text-xs text-nomad-400 mb-1">Net Income (TTM) $B</label>
              <input 
                type="number" 
                value={netIncome} 
                onChange={(e) => setNetIncome(parseFloat(e.target.value))}
                className="w-full bg-transparent text-xl text-white font-mono focus:outline-none" 
              />
            </div>
            <div className="bg-nomad-800/50 p-3 rounded-lg border border-nomad-700">
              <label className="block text-xs text-nomad-400 mb-1">Depreciation & Amort. $B</label>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">+</span>
                <input 
                  type="number" 
                  value={depreciation} 
                  onChange={(e) => setDepreciation(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-white font-mono focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-nomad-800/50 p-3 rounded-lg border border-nomad-700">
              <label className="block text-xs text-nomad-400 mb-1">Change in Work. Cap $B</label>
              <div className="flex items-center">
                 <span className="text-nomad-400 mr-2">±</span>
                <input 
                  type="number" 
                  value={workingCapital} 
                  onChange={(e) => setWorkingCapital(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-white font-mono focus:outline-none" 
                />
              </div>
            </div>
             <div className="bg-nomad-800/50 p-3 rounded-lg border border-nomad-700">
              <label className="block text-xs text-nomad-400 mb-1">Shares Outstanding (B)</label>
              <div className="flex items-center">
                <span className="text-nomad-400 mr-2">/</span>
                <input 
                  type="number" 
                  value={shares} 
                  onChange={(e) => setShares(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-white font-mono focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-nomad-800/50 p-4 rounded-lg border border-nomad-700">
            <div className="flex justify-between items-baseline mb-2">
               <label className="block text-xs text-nomad-400">Capital Expenditures (TTM) $B</label>
               <div className="text-xs text-yellow-600">
                 Maintenance Estimate: {maintenancePct}% (${maintenanceCapex.toFixed(2)}B)
               </div>
            </div>
            <div className="flex items-center mb-2">
                <span className="text-red-500 mr-2">-</span>
                <input 
                  type="number" 
                  value={capex} 
                  onChange={(e) => setCapex(parseFloat(e.target.value))}
                  className="w-full bg-transparent text-xl text-white font-mono focus:outline-none" 
                />
            </div>
            <input 
               type="range" 
               min="0" 
               max="100" 
               value={maintenancePct} 
               onChange={(e) => setMaintenancePct(Number(e.target.value))}
               className="w-full accent-yellow-600 h-1 bg-nomad-600 rounded-lg appearance-none cursor-pointer"
            />
             <p className="text-[10px] text-nomad-500 mt-2">
               Adjust slider to estimate "Maintenance CapEx". The rest is considered "Growth CapEx" and not subtracted.
            </p>
          </div>

        </div>

        {/* Result */}
        <div className="flex flex-col justify-center items-center bg-nomad-800 rounded-xl border border-nomad-700 p-6">
           <div className="text-center mb-6">
             <div className="text-nomad-400 text-sm uppercase tracking-wider mb-1">Calculated Owner's Earnings</div>
             <div className="text-4xl font-serif text-white">${ownersEarningsPerShare.toFixed(2)}</div>
             <div className="text-nomad-500 text-xs">Per Share</div>
           </div>
           
           <div className="w-full space-y-2 text-xs text-nomad-400 mb-6 font-mono bg-nomad-900/50 p-3 rounded">
             <div className="flex justify-between"><span>Net Income:</span> <span>${netIncome.toFixed(2)}B</span></div>
             <div className="flex justify-between"><span>+ D&A:</span> <span>${depreciation.toFixed(2)}B</span></div>
             <div className="flex justify-between"><span>± Work. Cap:</span> <span>${workingCapital > 0 ? '+' : ''}{workingCapital.toFixed(2)}B</span></div>
             <div className="flex justify-between text-red-400"><span>- Maint. CapEx:</span> <span>-${maintenanceCapex.toFixed(2)}B</span></div>
             <div className="border-t border-nomad-700 my-1 pt-1 flex justify-between text-white font-bold">
               <span>Total OE:</span> <span>${ownersEarningsTotal.toFixed(2)}B</span>
             </div>
           </div>

           <button
             onClick={() => onApply(ownersEarningsPerShare)}
             className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors"
           >
             Apply to Valuation Model
           </button>
        </div>
      </div>
    </div>
  );
};

export default OwnersEarningsCalculator;
