
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
      <div className="p-6 border-b border-nomad-700 bg-gradient-to-r from-nomad-800 to-nomad-900">
        <h2 className="text-2xl font-serif text-nomad-50">
          Recent News
        </h2>
        <p className="text-nomad-400 text-sm mt-1">
          Latest developments for {ticker}
        </p>
      </div>
      
      <div className="divide-y divide-nomad-700/50">
        {news.map((item, index) => (
          <div key={index} className="p-5 hover:bg-nomad-700/30 transition-colors group cursor-default">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-nomad-200 font-medium text-base leading-snug group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] text-nomad-400 uppercase tracking-wider border border-nomad-600 px-1.5 py-0.5 rounded bg-nomad-900/50">
                    {item.source}
                  </span>
                  <span className="text-xs text-nomad-500">
                    {item.date}
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