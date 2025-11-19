// services/geminiService.ts

import { CompanyData, AnalysisResult } from "../types";

type GeminiResponse = {
  text?: string;
  candidates?: any[];
};

// Calls the Netlify serverless Gemini function
async function callGemini(prompt: string, useSearch = false): Promise<GeminiResponse> {
  const res = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, useSearch }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini function error: ${body}`);
  }

  return res.json();
}

// ------------------------
// 1. FETCH COMPANY DATA
// ------------------------

export const fetchCompanyFinancials = async (ticker: string): Promise<CompanyData> => {
  const prompt = `
    Find the most recent financial data for ${ticker}. 
    I need the Current Stock Price, TTM Earnings Per Share (EPS), TTM Free Cash Flow (FCF) per share, and the Company Name.

    Also find the annual Revenue (in billions) and Net Profit Margin (percentage) for the last 5 years (2020-2024 approx).

    CRITICAL TTM VALUES (in BILLIONS USD):
      - Net Income
      - Depreciation & Amortization
      - Capital Expenditures (positive number)
      - Change in Working Capital
      - Shares Outstanding (in billions)

    Format STRICTLY as:

    \`\`\`json
    {
      "name": "Company Name",
      "price": 123.45,
      "eps": 5.67,
      "fcfPerShare": 6.78,
      "sharesOutstanding": 0.5,
      "currentPe": 20.5,
      "revenueGrowth5Y": 0.15,
      "description": "Short description.",
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
  `;

  const { text = "" } = await callGemini(prompt, true);

  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) {
    console.error("Gemini raw response:", text);
    throw new Error("Failed to parse financial data JSON");
  }

  try {
    const parsed = JSON.parse(match[1]);
    return {
      ticker: ticker.toUpperCase(),
      ...parsed,
    };
  } catch {
    throw new Error("Invalid JSON format from Gemini");
  }
};

// ------------------------
// 2. MOAT + KPI ANALYSIS
// ------------------------

export const analyzeMoatRobustness = async (
  ticker: string,
  companyName: string
): Promise<AnalysisResult> => {
  const prompt = `
    Analyze ${companyName} (${ticker}) using:
    
    1. Nick Sleep's "Scale Economics Shared"
       - Robustness Score 1-10
       - Does the company pass scale benefits to customers?

    2. Morningstar Moat Framework
       - Verdict: Wide, Narrow, or None
       - Source: Network Effects, Switching Costs, Intangible Assets, Cost Advantage, or Efficient Scale
       - Explanation of the moat

    3. Recent News (3 headlines from the last 30 days)

    4. Investor Presentation (Latest PDF or IR page)

    5. KPIs (3-4 key metrics, 3-5 years of data)

    Format as:

    \`\`\`json
    {
      "summary": "...",
      "robustnessScore": 8,
      "scaleEconomicsShared": "...",
      "moatVerdict": "Wide",
      "moatSource": "Cost Advantage",
      "moatDescription": "...",
      "news": [
        {"title": "Headline", "date": "YYYY-MM-DD", "source": "Bloomberg"}
      ],
      "investorPresentation": {
        "title": "Q3 Slides",
        "url": "https://..."
      },
      "kpis": [
        {
          "title": "Paid Subs",
          "unit": "Millions",
          "description": "...",
          "data": [
            {"year": "2020", "value": 203.6},
            {"year": "2021", "value": 221.8}
          ]
        }
      ]
    }
    \`\`\`
  `;

  const { text = "", candidates } = await callGemini(prompt, true);
  const match = text.match(/```json\n([\s\S]*?)\n```/);

  let parsed: any = {};
  if (match) {
    try {
      parsed = JSON.parse(match[1]);
    } catch (err) {
      console.error("JSON parse error:", err);
    }
  }

  // Fallback if parsing failed
  if (!parsed.summary) {
    parsed = {
      summary: text.slice(0, 200) + "...",
      robustnessScore: 5,
      scaleEconomicsShared: "Could not structure analysis.",
      moatVerdict: "Unknown",
      moatSource: "Unknown",
      moatDescription: "No detailed moat information.",
      news: [],
      kpis: [],
    };
  }

  const sources =
    candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((c: any) => (c.web ? { title: c.web.title, uri: c.web.uri } : null))
      .filter(Boolean) || [];

  return {
    summary: parsed.summary,
    robustnessScore: parsed.robustnessScore,
    scaleEconomicsShared: parsed.scaleEconomicsShared,
    moatVerdict: parsed.moatVerdict,
    moatSource: parsed.moatSource,
    moatDescription: parsed.moatDescription,
    news: parsed.news,
    investorPresentation: parsed.investorPresentation,
    kpis: parsed.kpis,
    sources: sources as any,
  };
};

