
import React from 'react';

interface Props {
  watchlist: string[];
  onSelect: (ticker: string) => void;
  onRemove: (ticker: string) => void;
}

const WatchlistBar: React.FC<Props> = ({ watchlist, onSelect, onRemove }) => {
  if (watchlist.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-8 mt-6">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-nomad-500 uppercase tracking-widest font-bold ml-1">
          Portfolio Watchlist
        </span>
        <div className="flex flex-wrap gap-2">
          {watchlist.map((ticker) => (
            <div 
              key={ticker}
              className="group flex items-center bg-nomad-800 hover:bg-nomad-700 border border-nomad-700 rounded-full pl-4 pr-2 py-1.5 transition-all cursor-pointer shadow-lg hover:shadow-yellow-900/10 hover:border-yellow-900/30"
              onClick={() => onSelect(ticker)}
            >
              <span className="text-sm font-medium text-nomad-200 group-hover:text-white mr-2">
                {ticker}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(ticker);
                }}
                className="p-1 rounded-full hover:bg-nomad-600/50 text-nomad-500 hover:text-red-400 transition-colors"
                title="Remove from watchlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchlistBar;
