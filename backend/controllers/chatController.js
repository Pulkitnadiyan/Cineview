import { GoogleGenAI } from "@google/genai";
import asynchandler from "../middlewares/asynchandlers.js";

// ✅ create a single client instance (outside handler)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatWithAI = asynchandler(async (req, res) => {
  const { message } = req.body;

  const systemInstruction = `
    You are a helpful movie assistant for an app called "Cineview". 
    Your goal is to help users find movies, discuss plots, and give recommendations.
    Keep your answers concise and engaging.
  `;

  const prompt = `${systemInstruction}\n\nUser: ${message}\nAssistant:`;

  try {
    // ✅ use new SDK style + new model
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",    // or "gemini-2.5-pro" if you want stronger
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // in @google/genai, text is a property
    const text = result.response.text;

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500);
    throw new Error("AI service failed");
  }
});

export { chatWithAI };
