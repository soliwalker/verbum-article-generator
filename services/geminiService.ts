
import { GoogleGenAI } from "@google/genai";
import { GenerationInput } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const generateSEOContent = async (input: GenerationInput): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key non configurata.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Genera un articolo SEO per PuraLuce.it basato sui seguenti dati:
    - KEYWORD_PRINCIPALE: ${input.keyword}
    - TEMA_SPECIFICO: ${input.theme}
    - INTENTO_DI_RICERCA: ${input.intent}
    
    Assicurati di seguire rigorosamente le istruzioni di sistema fornite in precedenza.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Errore nella generazione del contenuto.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Impossibile generare il contenuto al momento.");
  }
};
