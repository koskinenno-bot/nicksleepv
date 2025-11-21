
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
    setError(null);
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
      
      // Enhance error message for common 429 code
      let errorMessage = err.message || "An unexpected error occurred.";
      if (errorMessage.includes("429") || errorMessage.includes("Resource has been exhausted")) {
        errorMessage = "API Quota Exceeded (429). We tried retrying, but the limit persists. Please ensure your API key is linked to a billing account in Google AI Studio.";
      }
      
      setError(errorMessage);
      setLoadingState(LoadingState.ERROR);
    }
  };

  // If no API key is present, show the input screen
  if (!apiKey) {
    return <ApiKeyInput onSave={handleSaveKey} />;
  }

  return (
    <div className="min-h-screen bg-nomad-950 pb-20 relative selection:bg-yellow-500/30 selection:text-yellow-100">
      <SearchHeader onSearch={handleSearch} loadingState={loadingState} />

      <main className="max-w-6xl mx-auto px-6 mt-12 space-y-16">
        
        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className="bg-red-900/20 border border-red-800/50 text-red-200 p-8 rounded-xl text-center backdrop-blur-sm max-w-2xl mx-auto shadow-2xl">
            <div className="flex flex-col items-center gap-4">
               <div className="text-4xl mb-2">⚠️</div>
               <h3 className="text-xl font-serif text-white">Analysis Failed</h3>
               <p className="text-lg font-light opacity-90 leading-relaxed">{error}</p>
               <button 
                 onClick={clearKey}
                 className="mt-4 bg-red-900/50 hover:bg-red-800/50 text-white px-6 py-3 rounded-lg border border-red-700 transition-all text-sm font-bold uppercase tracking-wider hover:scale-105"
               >
                 Change API Key
               </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {loadingState === LoadingState.IDLE && (
          <div className="text-center mt-20 opacity-40">
            <div className="text-7xl mb-6 grayscale opacity-50">🏰</div>
            <p className="font-serif text-2xl text-nomad-300 font-light">Enter a ticker to analyze the moat.</p>
          </div>
        )}

        {/* Results */}
        {company && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-nomad-800 pb-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">
                  {company.name} 
                </h1>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-xl text-nomad-400 font-sans font-medium">{company.ticker}</span>
                    <span className="px-2 py-1 rounded bg-nomad-800 text-xs text-nomad-300 border border-nomad-700">${company.price.toFixed(2)}</span>
                </div>
                <p className="text-nomad-400 mt-4 max-w-3xl text-lg font-light leading-relaxed">{company.description}</p>
              </div>
              <div className="text-right hidden md:block bg-nomad-900/50 p-4 rounded-lg border border-nomad-800">
                <p className="text-nomad-500 text-xs uppercase tracking-widest font-bold">TTM EPS</p>
                <p className="text-nomad-200 font-mono text-xl">${company.eps}</p>
              </div>
            </div>

            {/* Tools */}
            <div className="grid grid-cols-1 gap-16">
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
                  <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {analysis.investorPresentation && (
                        <PresentationCard 
                            title={analysis.investorPresentation.title} 
                            url={analysis.investorPresentation.url} 
                        />
                        )}
                    </div>
                    
                    <div className="lg:col-span-2">
                        {analysis.news && analysis.news.length > 0 && (
                        <NewsFeed news={analysis.news} ticker={company.ticker} />
                        )}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-32 py-12 text-center border-t border-nomad-900 bg-nomad-950">
        <p className="text-nomad-500 text-sm">Inspired by the letters of the Nomad Investment Partnership (Nick Sleep & Qais Zakaria).</p>
        <p className="mt-2 text-xs text-nomad-600">Data generated via Gemini 3.0 Pro. Use for educational purposes only.</p>
        <button onClick={clearKey} className="mt-6 text-xs text-nomad-600 hover:text-yellow-500 transition-colors underline">
          Change API Key
        </button>
      </footer>
    </div>
  );
};

export default App;
