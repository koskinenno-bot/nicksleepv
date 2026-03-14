
import React from 'react';
import { WatchlistItem } from '../types';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  watchlist: WatchlistItem[];
  activeTicker: string | null;
  onSelect: (ticker: string) => void;
  onRemove: (ticker: string) => void;
}

const WatchlistSidebar: React.FC<Props> = ({ watchlist, activeTicker, onSelect, onRemove }) => {
  return (
    <div className="w-80 h-screen sticky top-0 bg-nomad-950 border-r border-nomad-900 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-nomad-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
          <h2 className="text-lg font-serif text-white tracking-tight">Watchlist</h2>
        </div>
        <span className="text-[10px] bg-nomad-800 text-nomad-400 px-2 py-1 rounded-full font-bold uppercase tracking-widest">
          {watchlist.length} Stocks
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {watchlist.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-nomad-500 text-sm italic">Your watchlist is empty. Search for a company to add it here.</p>
          </div>
        ) : (
          <div className="divide-y divide-nomad-900/50">
            {watchlist.map((item) => {
              const isActive = activeTicker === item.ticker;
              const change = item.change || (Math.random() * 4 - 2); // Mock change if not provided
              const isPositive = change > 0;
              
              return (
                <div 
                  key={item.ticker}
                  onClick={() => onSelect(item.ticker)}
                  className={`group relative p-4 transition-all cursor-pointer border-l-2 ${
                    isActive 
                      ? 'bg-nomad-900 border-yellow-500' 
                      : 'hover:bg-nomad-900/50 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-wider">{item.ticker}</span>
                      <span className="text-[10px] text-nomad-500 truncate max-w-[120px] uppercase tracking-tight">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-mono text-nomad-100">${item.price.toFixed(2)}</span>
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 52-Week Range Mockup */}
                  <div className="mt-3 flex flex-col gap-1">
                    <div className="flex justify-between text-[8px] text-nomad-600 uppercase tracking-tighter">
                      <span>52WK</span>
                      <div className="h-1 w-24 bg-nomad-800 rounded-full relative overflow-hidden">
                        <div 
                          className="absolute h-full bg-nomad-600 rounded-full" 
                          style={{ left: '20%', width: '60%' }}
                        ></div>
                        <div 
                          className="absolute h-2 w-2 bg-yellow-500 rounded-full -top-0.5 border border-nomad-950"
                          style={{ left: '45%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.ticker);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-nomad-800 text-nomad-500 hover:text-red-400 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-nomad-900/30 border-t border-nomad-900">
        <p className="text-[9px] text-nomad-600 uppercase tracking-widest text-center leading-relaxed">
          Nomad Investment Partnership<br/>
          <span className="opacity-50">Quality Compounders Only</span>
        </p>
      </div>
    </div>
  );
};

export default WatchlistSidebar;
