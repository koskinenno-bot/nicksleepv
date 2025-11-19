
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
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-nomad-800 rounded-xl border border-nomad-700 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-nomad-100 mb-2">Welcome</h1>
          <p className="text-nomad-400 text-sm">
            To use the Nick Sleep Valuation Model, you need a Google Gemini API Key.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase text-nomad-500 tracking-wider mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-nomad-900 border border-nomad-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-600 transition-colors"
            />
            <p className="text-xs text-nomad-500 mt-2">
              Your key is stored locally in your browser.
            </p>
          </div>

          <button
            type="submit"
            disabled={key.length < 10}
            className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
          >
            Start Analyzing
          </button>

          <div className="text-center pt-4 border-t border-nomad-700">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-yellow-500 hover:text-yellow-400 underline"
            >
              Get a free API Key here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyInput;
