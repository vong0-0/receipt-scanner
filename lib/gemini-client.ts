import { GoogleGenAI } from "@google/genai";

// Gemini client
export const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
