import { GoogleGenAI } from "@google/genai";
import asynchandler from "../middlewares/asynchandlers.js";

// Create client once
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatWithAI = asynchandler(async (req, res) => {
  const { message } = req.body;

  const systemInstruction = `
    You are a helpful movie assistant for an app called "Cineview". 
    Your goal is to help users find movies, discuss plots, and give recommendations.
    Keep your answers concise and engaging.
    you can only respond about movies, do not discuss anything else.
    Provide responses in a friendly and conversational tone.
    reccomend movies based on genres, moods, or themes which are available on Cineview platform.
    Talk about the movies that are available on Cineview platform only,otherwise politely inform the user that the movie is not available on Cineview.
  `;

  const prompt = `${systemInstruction}\n\nUser: ${message}\nAssistant:`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",      // ✅ current model
      // you can pass a plain string as contents
      contents: prompt,
    });

    // ✅ with @google/genai, the text is here:
    const text = result.text;

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500);
    throw new Error("AI service failed");
  }
});

export { chatWithAI };
