// netlify/functions/gemini.js
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;
    const model = body.model || "gemini-2.5-flash";
    const useSearch = !!body.useSearch;

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const request = {
      model,
      contents: prompt,
    };

    if (useSearch) {
      request.config = { tools: [{ googleSearch: {} }] };
    }

    const response = await client.models.generateContent(request);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: response.text,
        candidates: response.candidates,
      }),
    };
  } catch (error) {
    console.error("Gemini function error", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error?.message || "Unknown Gemini error",
      }),
    };
  }
}
