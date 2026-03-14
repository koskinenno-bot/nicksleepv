
export interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change?: number;
}

export interface CompanyData {
  ticker: string;
  name: string;
  price: number;
  eps: number;
  fcfPerShare: number;
  revenueGrowth5Y: number; // Average annualized
  currentPe: number;
  description: string;
  sharesOutstanding: number; // in Billions
  financials: {
    year: string;
    revenue: number;
    netMargin: number;
    eps: number; // Added EPS history
    changeInWorkingCapital?: number; // Added for normalization
  }[];
  ttmFinancials: {
    netIncome: number;
    depreciation: number;
    stockBasedCompensation: number;
    changeInWorkingCapital: number;
    normalizedWorkingCapital?: number; // 5-10 year average
    capitalExpenditures: number;
    suggestedMaintenanceCapexPct?: number; // AI estimated percentage
  };
}

export interface NewsItem {
  title: string;
  date: string;
  source: string;
  category?: 'Signal' | 'Noise';
  reasoning?: string;
}

export interface CapitalAllocationData {
  year: string;
  capex: number;
  rd: number;
  dividends: number;
  buybacks: number;
  revenue: number;
  marketCap: number;
  reinvestment: number; // Sum of capex + rd
  payout: number; // Sum of dividends + buybacks
}

export interface KpiDataPoint {
  year: string;
  value: number;
}

export interface KpiItem {
  title: string;
  unit: string;
  data: KpiDataPoint[];
  description?: string;
}

export interface DestinationSuggestion {
  scenario: string; // e.g., "Conservative", "Base", "Optimistic"
  growthRate: number;
  terminalMultiple: number;
  reasoning: string;
}

export interface AnalysisResult {
  summary: string;
  robustnessScore: number; // 1-10
  scaleEconomicsShared: string;
  moatVerdict: string; // Wide, Narrow, None
  moatSource: string;
  moatDescription: string;
  sources: {
    title: string;
    uri: string;
  }[];
  news: NewsItem[];
  investorPresentation?: {
    title: string;
    url: string;
  };
  kpis?: KpiItem[];
  managementAnalysis?: {
    score: number; // 1-10
    verdict: string; // e.g. "Fanatical", "Long-term", "Corporate"
    details: string;
    traits: string[];
  };
  capitalAllocation?: CapitalAllocationData[];
  destinationSuggestions?: DestinationSuggestion[];
}

export interface ValuationScenario {
  growthRate: number;
  impliedPrice: number;
  years: number;
  discountRate: number;
  terminalMultiple: number;
}

export enum LoadingState {
  IDLE,
  SEARCHING,
  ANALYZING,
  COMPLETE,
  ERROR
}