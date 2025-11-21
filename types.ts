
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
  }[];
  ttmFinancials: {
    netIncome: number;
    depreciation: number;
    stockBasedCompensation: number;
    changeInWorkingCapital: number;
    capitalExpenditures: number;
  };
}

export interface NewsItem {
  title: string;
  date: string;
  source: string;
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