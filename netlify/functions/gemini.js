// netlify/functions/gemini.js

const { GoogleGenAI } = require("@google/genai");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // If Netlify env var is missing, bail out with a clear message
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "GEMINI_API_KEY env variable is NOT set in Netlify.",
      }),
    };
  }

  // Create client ONLY after we know we have an API key
  const client = new GoogleGenAI({ apiKey });

  try {
    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;
    const model = body.model || "gemini-2.5-flash";

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const response = await client.models.generateContent({
      model,
      contents: prompt,
    });

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
};
