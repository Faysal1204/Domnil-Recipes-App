
import { GoogleGenAI } from "@google/genai";

// Ensure process.env.API_KEY is available in your environment.
// The platform handles this.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const model = "gemini-2.5-flash";
const systemInstruction = "You are a friendly and helpful AI cooking assistant named 'Chef Gemini'. You specialize in recipes, cooking techniques, ingredient substitutions, and kitchen tips. Keep your answers concise, friendly, and easy to understand. Do not recommend external websites or videos. Format your responses with markdown for clarity, using lists and bold text where appropriate.";

export const geminiService = {
  async askCookingAssistant(prompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "I'm sorry, but I'm having trouble connecting to my kitchen knowledge base. Please try again in a moment.";
    }
  },
};
