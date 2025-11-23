
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CompanyData, AnalysisResult } from "../types";

const getClient = (apiKey?: string) => {
  // Prioritize the user-provided key, fallback to environment variable
  const key = apiKey || process.env.API_KEY;

  if (!key) throw new Error("API Key is missing. Please provide a valid Gemini API Key.");
  
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Retries an async operation with exponential backoff if a 429 (Rate Limit) or 503 (Overloaded) error occurs.
 */
const retryWithBackoff = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Check for common error patterns in the SDK
    const msg = error?.message || '';
    const status = error?.status || error?.code; 

    const isRateLimit = msg.includes('429') || msg.includes('Resource has been exhausted') || status === 429;
    const isOverloaded = msg.includes('503') || msg.includes('overloaded') || status === 503;

    if ((isRateLimit || isOverloaded) && retries > 0) {
      console.warn(`API Error (${status || 'unknown'}). Retrying in ${delay}ms... (Attempts left: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * smartGenerate: Tries the Pro model first. If it fails due to capacity (503) or quota (429),
 * falls back to the Flash model.
 */
const smartGenerate = async (ai: GoogleGenAI, contents: string, tools: any[] = []): Promise<GenerateContentResponse> => {
  // 1. Try Gemini 3.0 Pro (Most capable, but prone to 503/429 in preview)
  try {
    return await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: contents,
        config: { tools },
      });
    }, 2, 1000); // 2 retries only for Pro to fail fast
  } catch (error: any) {
    const msg = error?.message || '';
    // Only fallback on availability errors. If it's a 400 (Bad Request), fallback won't help.
    const isAvailabilityIssue = msg.includes('503') || msg.includes('429') || msg.includes('overloaded') || msg.includes('exhausted');

    if (isAvailabilityIssue) {
      console.warn("Gemini 3.0 Pro is overloaded/limited. Falling back to Gemini 2.5 Flash.");
      
      // 2. Fallback to Gemini 2.5 Flash (Very stable, higher quotas)
      return await retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: contents,
          config: { tools },
        });
      }, 3, 2000); // Standard retry for Flash
    }
    
    throw error;
  }
};

export const fetchCompanyFinancials = async (ticker: string, apiKey?: string): Promise<CompanyData> => {
  const ai = getClient(apiKey);
  
  const prompt = `
  Find the most recent financial data for ${ticker}. 
  I need the Current Stock Price, TTM Earnings Per Share (EPS), TTM Free Cash Flow (FCF) per share, and the Company Name.
  Also, find the annual Revenue (in billions) and Net Profit Margin (as a percentage) for the last 5 years (2020-2024 approx).
  
  CRITICAL: I also need the following TTM (Trailing Twelve Months) absolute values in BILLIONS USD to calculate Owner's Earnings:
  1. Net Income (TTM)
  2. Depreciation & Amortization (TTM)
  3. Stock Based Compensation (TTM) - Return as a positive number.
  4. Capital Expenditures (TTM) - Return as a positive number.
  5. Change in Working Capital (TTM)
  6. Shares Outstanding (in Billions)

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
      "stockBasedCompensation": 1.2,
      "capitalExpenditures": 3.0,
      "changeInWorkingCapital": -0.5
    }
  }
  \`\`\`
  Note: revenueGrowth5Y should be a decimal (e.g., 0.10 for 10%). Net margin should be the percentage value (e.g., 12.5).
  `;

  const response = await smartGenerate(ai, prompt, [{ googleSearch: {} }]);

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

export const analyzeMoatRobustness = async (ticker: string, companyName: string, apiKey?: string): Promise<AnalysisResult> => {
  const ai = getClient(apiKey);
  
  const prompt = `
  Analyze ${companyName} (${ticker}) using two frameworks and find recent data:
  
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
     - SEARCH for the latest "Investor Presentation" or "Earnings Slides" for ${companyName}.
     - PREFERRED: A direct link to the specific presentation (PDF or webpage).
     - ACCEPTABLE FALLBACK: The main Investor Relations homepage if a specific link is hard to find or might expire.
     - Return the title and the URL.

  5. Key Performance Indicators (KPIs):
     - Identify 3-4 critical quantitative KPIs that drive this specific business (e.g. for Netflix: "Global Paid Subs"; for Retail: "Same Store Sales" or "Store Count"; for Tech: "Daily Active Users" or "Cloud Revenue").
     - Provide 3-5 years of historical data for each KPI.
     - Ensure the 'value' is a number (no symbols).
     
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
    },
    "kpis": [
       {
         "title": "Paid Subscribers",
         "unit": "Millions",
         "description": "Total global paying memberships",
         "data": [
           {"year": "2020", "value": 203.6},
           {"year": "2021", "value": 221.8}
         ]
       }
    ]
  }
  \`\`\`
  `;

  const response = await smartGenerate(ai, prompt, [{ googleSearch: {} }]);

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
      kpis: []
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
    kpis: result.kpis || [],
    sources: sources as any
  };
};
