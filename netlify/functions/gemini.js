// netlify/functions/gemini.js

const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  // This MUST be set in Netlify env vars as GEMINI_API_KEY
  apiKey: process.env.GEMINI_API_KEY,
});

exports.handler = async function (event, context) {
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

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    // SIMPLE CALL: no googleSearch tool, no Cloud credentials needed
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
