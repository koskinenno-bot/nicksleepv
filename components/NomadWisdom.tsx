
import React, { useState, useEffect } from 'react';

const quotes = [
  "The best businesses are those that can grow for a long time. The destination is more important than the path.",
  "Scale economics shared is a powerful flywheel. By giving back to the customer, you widen the moat.",
  "We want to be in businesses where the competitive advantage is growing, not just existing.",
  "The stock market is a distraction. Focus on the business and its long-term destination.",
  "High quality management is fanatical about the customer and the long-term health of the firm.",
  "Growth is not just about size; it's about the widening of the gap between value and price.",
  "We are looking for 'mispriced' quality—businesses that are much better than the market realizes.",
  "Patience is the ultimate competitive advantage in investing."
];

const NomadWisdom: React.FC = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 border-t border-nomad-900 mt-20">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-yellow-500/20 text-6xl font-serif">"</div>
        <p className="text-xl md:text-2xl font-serif text-nomad-300 italic leading-relaxed">
          {quote}
        </p>
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-nomad-800"></div>
          <span className="text-xs uppercase tracking-[0.3em] text-nomad-500 font-bold">Nomad Letters</span>
          <div className="h-px w-8 bg-nomad-800"></div>
        </div>
      </div>
    </div>
  );
};

export default NomadWisdom;
