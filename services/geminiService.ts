
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAIRecommendation = async (mood: string) => {
  if (!ai) {
    return { suggestion: "Hamburguesa", reason: "Porque siempre es una buena idea (y el servicio de IA no está configurado)." };
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `El usuario tiene ganas de: ${mood}. Sugiere un tipo de comida (como hamburguesa, pizza, sushi) y una razón corta y divertida. Responde en español y en formato JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    });
    // Extract text from GenerateContentResponse using the .text property.
    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return { suggestion: "Hamburguesa", reason: "Porque siempre es una buena idea." };
  }
};
