import { GoogleGenerativeAI } from "@google/generative-ai";
import asynchandler from "../middlewares/asynchandlers.js";

const chatWithAI = asynchandler(async (req, res) => {
  const { message } = req.body;

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // Define Context (System Prompt)
  const systemInstruction = `
    You are a helpful movie assistant for an app called "Cineview". 
    Your goal is to help users find movies, discuss plots, and give recommendations.
    Keep your answers concise and engaging.
  `;

  // Generate Content
  // Note: For simple chat, we can just send the prompt. 
  // For context-aware chat, we would maintain history, but let's start simple.
  const prompt = `${systemInstruction}\n\nUser: ${message}\nAssistant:`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("AI service failed");
  }
});

export { chatWithAI };