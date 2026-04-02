import React, { useState } from 'react';
import { LoadingState } from '../types';

interface Props {
  onSearch: (ticker: string) => void;
  loadingState: LoadingState;
  compact?: boolean;
}

const SearchHeader: React.FC<Props> = ({ onSearch, loadingState, compact }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const isLoading = loadingState === LoadingState.SEARCHING || loadingState === LoadingState.ANALYZING;

  return (
    <header className={`sticky top-0 z-30 w-full border-b border-nomad-800 bg-nomad-950/80 backdrop-blur-md transition-all duration-500 ${compact ? 'py-3 md:py-4' : 'py-10 md:py-16'}`}>
      {/* Subtle background glow */}
      {!compact && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>
      )}

      <div className={`max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center relative z-10 ${compact ? 'md:flex-row md:justify-between gap-4' : ''}`}>
        {!compact && (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nomad-800/50 border border-nomad-700/50 text-[10px] md:text-xs font-medium text-nomad-400 mb-4 md:mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Gemini 3.1 Powered
            </div>

            <h1 className="text-3xl md:text-6xl font-serif font-medium text-nomad-50 mb-4 md:mb-6 tracking-tight text-center">
              How to value like <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Nick Sleep</span>
            </h1>
            
            <p className="text-nomad-400 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed text-base md:text-lg font-light text-center">
              "The correct way to value a business is to calculate the discounted value of all future cash flows."
            </p>
          </>
        )}

        {compact && (
          <div className="flex items-center gap-3 self-start md:self-auto mb-4 md:mb-0">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-nomad-950 font-serif font-bold text-xl">N</div>
            <h2 className="text-lg font-serif text-white hidden sm:block">Nomad Terminal</h2>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={`relative w-full group ${compact ? 'max-w-full md:max-w-md' : 'max-w-lg'}`}>
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search Ticker..."
            className={`relative w-full bg-nomad-800/80 border border-nomad-600 text-nomad-100 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 placeholder-nomad-500 transition-all shadow-2xl backdrop-blur-sm ${compact ? 'py-2 px-6 text-sm' : 'py-3 md:py-4 px-6 md:px-8 text-base md:text-lg'}`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute right-1.5 top-1.5 bottom-1.5 bg-nomad-700 hover:bg-yellow-600 text-nomad-200 hover:text-white rounded-full transition-all disabled:opacity-50 disabled:hover:bg-nomad-700 ${compact ? 'px-4 text-xs' : 'px-5 md:px-6 text-xs md:text-sm font-medium'}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {compact ? '' : 'Searching'}
              </span>
            ) : compact ? 'Search' : 'Analyze'}
          </button>
        </form>
        
        {!compact && (
          <div className="h-6 mt-4 text-center">
            {loadingState === LoadingState.SEARCHING && (
              <p className="text-xs md:text-sm text-nomad-400 animate-pulse font-medium">Gathering financial data from multiple sources...</p>
            )}
            {loadingState === LoadingState.ANALYZING && (
              <p className="text-xs md:text-sm text-nomad-400 animate-pulse font-medium">AI analyzing moat durability & scale economics...</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default SearchHeader;