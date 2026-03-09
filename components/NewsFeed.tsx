
import React from 'react';
import { NewsItem } from '../types';

interface Props {
  news: NewsItem[];
  ticker: string;
}

const NewsFeed: React.FC<Props> = ({ news, ticker }) => {
  if (!news || news.length === 0) return null;

  return (
    <div className="bg-nomad-800 rounded-xl border border-nomad-700 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-nomad-700 bg-gradient-to-r from-nomad-800 to-nomad-900 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif text-nomad-50">
            Noise vs. Signal
          </h2>
          <p className="text-nomad-400 text-sm mt-1">
            Filtering developments for {ticker}
          </p>
        </div>
        <div className="text-[10px] text-nomad-500 uppercase tracking-widest font-bold italic">
          "Ignore the noise, focus on the destination."
        </div>
      </div>
      
      <div className="divide-y divide-nomad-700/50">
        {news.map((item, index) => (
          <div key={index} className="p-5 hover:bg-nomad-700/30 transition-colors group cursor-default">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    item.category === 'Signal' 
                      ? 'bg-green-900/30 text-green-400 border-green-800/50' 
                      : 'bg-red-900/30 text-red-400 border-red-800/50'
                  }`}>
                    {item.category || 'News'}
                  </span>
                  <span className="text-xs text-nomad-500">
                    {item.date}
                  </span>
                </div>
                <h3 className="text-nomad-200 font-medium text-base leading-snug group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                {item.reasoning && (
                  <p className="text-xs text-nomad-400 mt-2 italic leading-relaxed">
                    <span className="text-nomad-500 font-bold uppercase text-[9px] mr-1 not-italic">Reasoning:</span>
                    {item.reasoning}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] text-nomad-400 uppercase tracking-wider border border-nomad-600 px-1.5 py-0.5 rounded bg-nomad-900/50">
                    {item.source}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;