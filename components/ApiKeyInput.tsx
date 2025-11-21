
import React, { useState } from 'react';

interface Props {
  onSave: (key: string) => void;
}

const ApiKeyInput: React.FC<Props> = ({ onSave }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim().length > 10) {
      onSave(key.trim());
    }
  };

  return (
    <div className="min-h-screen bg-nomad-950 flex items-center justify-center p-6 relative overflow-hidden">
       {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-nomad-900/80 backdrop-blur-lg rounded-2xl border border-nomad-700 shadow-2xl p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-12 h-12 bg-nomad-800 rounded-xl mb-4 border border-nomad-700 text-2xl shadow-lg">
            🏰
          </div>
          <h1 className="text-3xl font-serif text-nomad-50 mb-3">Welcome</h1>
          <p className="text-nomad-400 text-sm leading-relaxed">
            To use the Nick Sleep Valuation Model, you need a Google Gemini API Key.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase text-nomad-500 tracking-wider mb-2 font-bold">
              Gemini API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-nomad-950 border border-nomad-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/50 transition-all placeholder-nomad-700"
            />
            <p className="text-[10px] text-nomad-500 mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Key stored locally in your browser.
            </p>
          </div>

          <button
            type="submit"
            disabled={key.length < 10}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-nomad-950 font-bold py-3 rounded-lg transition-all shadow-lg shadow-yellow-900/20 transform active:scale-[0.98]"
          >
            Start Analyzing
          </button>

          <div className="text-center pt-6 border-t border-nomad-800/50">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-nomad-400 hover:text-yellow-500 underline transition-colors"
            >
              Get a free API Key from Google
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyInput;