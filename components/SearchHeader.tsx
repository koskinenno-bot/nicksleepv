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
    <header className="w-full py-12 px-6 border-b border-nomad-800 bg-nomad-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-nomad-100 mb-4">
          Value like <span className="italic text-yellow-600/80">Sleep</span>
        </h1>
        <p className="text-nomad-300 mb-8 max-w-xl mx-auto leading-relaxed">
          "The correct way to value a business is to calculate the discounted value of all future cash flows."
        </p>
        
        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Ticker (e.g. COST, AMZN)"
            className="w-full bg-nomad-800 border border-nomad-600 text-nomad-100 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-yellow-600/50 placeholder-nomad-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1.5 bg-nomad-600 hover:bg-nomad-500 text-nomad-100 rounded-full p-2 px-4 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
        
        {loadingState === LoadingState.SEARCHING && (
          <p className="mt-4 text-sm text-nomad-400 animate-pulse">Gathering financial data...</p>
        )}
        {loadingState === LoadingState.ANALYZING && (
          <p className="mt-4 text-sm text-nomad-400 animate-pulse">Analyzing scale economies...</p>
        )}
      </div>
    </header>
  );
};

export default SearchHeader;