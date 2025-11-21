import React, { useState } from 'react';
import { LoadingState } from '../types';

interface Props {
  onSearch: (ticker: string) => void;
  loadingState: LoadingState;
}

const SearchHeader: React.FC<Props> = ({ onSearch, loadingState }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const isLoading = loadingState === LoadingState.SEARCHING || loadingState === LoadingState.ANALYZING;

  return (
    <header className="w-full py-16 px-6 border-b border-nomad-800 bg-gradient-to-b from-nomad-900 to-nomad-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nomad-800/50 border border-nomad-700/50 text-xs font-medium text-nomad-400 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Gemini 2.5 Powered
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-medium text-nomad-50 mb-6 tracking-tight">
          How to value like <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Nick Sleep</span>
        </h1>
        
        <p className="text-nomad-400 mb-10 max-w-xl mx-auto leading-relaxed text-lg font-light">
          "The correct way to value a business is to calculate the discounted value of all future cash flows."
        </p>
        
        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto group">
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Ticker (e.g. AMZN, COST, BRK.B)"
            className="relative w-full bg-nomad-800/80 border border-nomad-600 text-nomad-100 rounded-full py-4 px-8 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-600 placeholder-nomad-500 transition-all shadow-2xl backdrop-blur-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-2 bottom-2 bg-nomad-700 hover:bg-yellow-600 text-nomad-200 hover:text-white rounded-full px-6 text-sm font-medium transition-all disabled:opacity-50 disabled:hover:bg-nomad-700"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </span>
            ) : 'Analyze'}
          </button>
        </form>
        
        <div className="h-6 mt-4">
          {loadingState === LoadingState.SEARCHING && (
            <p className="text-sm text-nomad-400 animate-pulse font-medium">Gathering financial data from multiple sources...</p>
          )}
          {loadingState === LoadingState.ANALYZING && (
            <p className="text-sm text-nomad-400 animate-pulse font-medium">AI analyzing moat durability & scale economics...</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;