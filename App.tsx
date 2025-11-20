
import React, { useState, useEffect } from 'react';
import { CompanyData, AnalysisResult, LoadingState } from './types';
import { fetchCompanyFinancials, analyzeMoatRobustness } from './services/geminiService';
import SearchHeader from './components/SearchHeader';
import ValuationTool from './components/ValuationTool';
import MoatAnalyzer from './components/MoatAnalyzer';
import NewsFeed from './components/NewsFeed';
import PresentationCard from './components/PresentationCard';
import KpiDashboard from './components/KpiDashboard';
import ApiKeyInput from './components/ApiKeyInput';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    const envKey = process.env.API_KEY;
    
    if (storedKey) {
      setApiKey(storedKey);
    } else if (envKey) {
      setApiKey(envKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };

  const clearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setCompany(null);
    setAnalysis(null);
  };

  const handleSearch = async (ticker: string) => {
    if (!apiKey) return;
    
    setLoadingState(LoadingState.SEARCHING);
    setError(null);
    setCompany(null);
    setAnalysis(null);

    try {
      // 1. Get Financials
      const financialData = await fetchCompanyFinancials(ticker, apiKey);
      setCompany(financialData);
      
      // 2. Analyze Qualitative Aspects
      setLoadingState(LoadingState.ANALYZING);
      const analysisData = await analyzeMoatRobustness(ticker, financialData.name, apiKey);
      setAnalysis(analysisData);
      
      setLoadingState(LoadingState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please check your API Key or try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  // If no API key is present, show the input screen
  if (!apiKey) {
    return <ApiKeyInput onSave={handleSaveKey} />;
  }

  return (
    <div className="min-h-screen bg-[#111] pb-20 relative">
      <SearchHeader onSearch={handleSearch} loadingState={loadingState} />

      <main className="max-w-6xl mx-auto px-6 mt-8 space-y-10">
        
        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {loadingState === LoadingState.IDLE && (
          <div className="text-center mt-20 opacity-40">
            <div className="text-6xl mb-4">🏰</div>
            <p className="font-serif text-xl text-nomad-300">Enter a ticker to analyze the moat.</p>
          </div>
        )}

        {/* Results */}
        {company && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Info */}
            <div className="flex items-baseline justify-between mb-4 border-b border-nomad-800 pb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
                  {company.name} <span className="text-nomad-500 text-xl font-sans font-normal">({company.ticker})</span>
                </h1>
                <p className="text-nomad-400 mt-1 max-w-2xl">{company.description}</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-nomad-500 text-sm uppercase">TTM EPS</p>
                <p className="text-nomad-200 font-mono">${company.eps}</p>
              </div>
            </div>

            {/* Tools */}
            <div className="grid grid-cols-1 gap-12">
              <section>
                <ValuationTool company={company} />
              </section>

              {analysis && (
                <>
                  <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <MoatAnalyzer company={company} analysis={analysis} />
                  </section>

                  {/* KPI Section */}
                  {analysis.kpis && analysis.kpis.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-250">
                      <KpiDashboard kpis={analysis.kpis} />
                    </section>
                  )}

                  {/* Investor Presentation & News Section */}
                  <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 grid grid-cols-1 gap-8">
                    {analysis.investorPresentation && (
                      <PresentationCard 
                        title={analysis.investorPresentation.title} 
                        url={analysis.investorPresentation.url} 
                      />
                    )}
                    
                    {analysis.news && analysis.news.length > 0 && (
                      <NewsFeed news={analysis.news} ticker={company.ticker} />
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-20 py-8 text-center text-nomad-600 text-sm border-t border-nomad-900">
        <p>Inspired by the letters of the Nomad Investment Partnership (Nick Sleep & Qais Zakaria).</p>
        <p className="mt-2 text-xs">Data generated via Gemini AI. Use for educational purposes only.</p>
        <button onClick={clearKey} className="mt-4 text-xs text-nomad-700 hover:text-yellow-600 transition-colors underline">
          Change API Key
        </button>
      </footer>
    </div>
  );
};

export default App;
