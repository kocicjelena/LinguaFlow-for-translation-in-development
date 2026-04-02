import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateJSON(targetLanguage: string, jsonContent: any) {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are a professional software localization engine.
    
    TASK:
    Translate the values of the provided JSON object into ${targetLanguage}.
    
    RULES:
    1. Output MUST be valid JSON.
    2. Do NOT change any keys. Only translate the values.
    3. Maintain the same data structure (nested objects, arrays).
    4. Do not translate brand names if they look like proper nouns (e.g., "TaskMaster").
    5. Ensure the tone is professional and suitable for a software interface.
    
    INPUT JSON:
    ${JSON.stringify(jsonContent, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Translation failed:", error);
    throw error;
  }
}