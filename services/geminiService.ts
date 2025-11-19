
import { GoogleGenAI } from "@google/genai";
import { CompanyData, AnalysisResult } from "../types";

// Internal storage for the key
let dynamicApiKey: string | null = null;

export const setApiKey = (key: string) => {
  dynamicApiKey = key;
  localStorage.setItem('gemini_api_key', key);
};

export const hasApiKey = (): boolean => {
  if (dynamicApiKey) return true;
  if (localStorage.getItem('gemini_api_key')) {
    dynamicApiKey = localStorage.getItem('gemini_api_key');
    return true;
  }
  // Safe check for process.env in case we are in a build environment
  try {
    if (process.env.API_KEY) {
      dynamicApiKey = process.env.API_KEY;
      return true;
    }
  } catch (e) {
    // process is not defined, ignore
  }
  return false;
};

export const clearApiKey = () => {
  dynamicApiKey = null;
  localStorage.removeItem('gemini_api_key');
};

const getClient = () => {
  if (!dynamicApiKey) {
    // Try to reload from storage
    if (localStorage.getItem('gemini_api_key')) {
       dynamicApiKey = localStorage.getItem('gemini_api_key');
    } else {
       // Last ditch effort for env var
       try {
         if (process.env.API_KEY) dynamicApiKey = process.env.API_KEY;
       } catch(e) {}
    }
  }

  if (!dynamicApiKey) throw new Error("API Key is missing. Please provide it in the settings.");
  
  return new GoogleGenAI({ apiKey: dynamicApiKey });
};

export const fetchCompanyFinancials = async (ticker: string): Promise<CompanyData> => {
  const ai = getClient();
  
  const prompt = `
  Find the most recent financial data for ${ticker}. 
  I need the Current Stock Price, TTM Earnings Per Share (EPS), TTM Free Cash Flow (FCF) per share, and the Company Name.
  Also, find the annual Revenue (in billions) and Net Profit Margin (as a percentage) for the last 5 years (2020-2024 approx).
  
  CRITICAL: I also need the following TTM (Trailing Twelve Months) absolute values in BILLIONS USD to calculate Owner's Earnings:
  1. Net Income (TTM)
  2. Depreciation & Amortization (TTM)
  3. Capital Expenditures (TTM) - Return as a positive number.
  4. Change in Working Capital (TTM)
  5. Shares Outstanding (in Billions)

  Format the output strictly as a JSON object inside a code block like this:
  \`\`\`json
  {
    "name": "Company Name",
    "price": 123.45,
    "eps": 5.67,
    "fcfPerShare": 6.78,
    "sharesOutstanding": 0.5,
    "currentPe": 20.5,
    "revenueGrowth5Y": 0.15,
    "description": "Short one sentence description.",
    "financials": [
      {"year": "2020", "revenue": 50.5, "netMargin": 12.5},
      {"year": "2021", "revenue": 60.2, "netMargin": 13.0}
    ],
    "ttmFinancials": {
      "netIncome": 10.5,
      "depreciation": 2.5,
      "capitalExpenditures": 3.0,
      "changeInWorkingCapital": -0.5
    }
  }
  \`\`\`
  Note: revenueGrowth5Y should be a decimal (e.g., 0.10 for 10%). Net margin should be the percentage value (e.g., 12.5).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  
  // Extract JSON from markdown code block
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) {
    console.error("Raw response:", text);
    throw new Error("Failed to parse financial data from AI response");
  }

  try {
    const data = JSON.parse(jsonMatch[1]);
    return {
      ticker: ticker.toUpperCase(),
      ...data
    };
  } catch (e) {
    throw new Error("Invalid JSON format received from AI");
  }
};

export const analyzeMoatRobustness = async (ticker: string, companyName: string): Promise<AnalysisResult> => {
  const ai = getClient();
  
  const prompt = `
  Analyze ${companyName} (${ticker}) using two frameworks:
  
  1. Nick Sleep's "Scale Economics Shared" (Robustness Ratio):
     - Does the company pass on scale benefits to customers (lower prices) or keep them as margins?
     - Robustness Score 1-10 (10 = Costco/Amazon).

  2. General Moat Analysis (Morningstar style):
     - Verdict: "Wide", "Narrow", or "None".
     - Primary Source: "Network Effects", "Switching Costs", "Intangible Assets", "Cost Advantage", or "Efficient Scale".
     - Detailed explanation of the moat.

  3. Recent News:
     - Find 3 recent news headlines/events relevant to the company stock or business from the last 30 days.
  
  4. Investor Presentation:
     - Find the URL for the most recent Investor Presentation, Earnings Presentation, or Strategic Update Slideshow (PDF or Webpage). 
     - Return the title (e.g., "Q3 2024 Earnings Presentation") and the URL.

  Format the output strictly as a JSON object inside a code block:
  \`\`\`json
  {
    "summary": "Brief executive summary of the business quality.",
    "robustnessScore": 8,
    "scaleEconomicsShared": "Specific analysis of scale economics shared...",
    "moatVerdict": "Wide",
    "moatSource": "Cost Advantage",
    "moatDescription": "Explanation of why the moat is wide/narrow...",
    "news": [
      {"title": "Headline 1", "date": "YYYY-MM-DD", "source": "Bloomberg"},
      {"title": "Headline 2", "date": "...", "source": "Reuters"}
    ],
    "investorPresentation": {
       "title": "Q3 2024 Earnings Slides",
       "url": "https://..."
    }
  }
  \`\`\`
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  
  let result: Partial<AnalysisResult> = {};
  if (jsonMatch) {
    try {
      result = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error("JSON Parse Error", e);
    }
  }
  
  if (!result.summary) {
    result = {
      summary: text.slice(0, 200) + "...",
      robustnessScore: 5,
      scaleEconomicsShared: "Could not structure analysis.",
      moatVerdict: "Unknown",
      moatSource: "Unknown",
      moatDescription: "Analysis failed to parse.",
      news: [],
    };
  }

  // Extract sources if available
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => {
      if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
      return null;
    })
    .filter(Boolean) || [];

  return {
    summary: result.summary || "",
    robustnessScore: result.robustnessScore || 5,
    scaleEconomicsShared: result.scaleEconomicsShared || "",
    moatVerdict: result.moatVerdict || "Unknown",
    moatSource: result.moatSource || "Unknown",
    moatDescription: result.moatDescription || "No details provided.",
    news: result.news || [],
    investorPresentation: result.investorPresentation,
    sources: sources as any
  };
};
