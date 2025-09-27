
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const extractNamesFromText = async (text: string): Promise<string[]> => {
    if (!ai) {
        throw new Error("Gemini AI not initialized. Please set your API_KEY.");
    }

    try {
        const prompt = `From the following text, extract only the names of people. Return each name on a new line. Do not include any other text, numbers, or bullet points. If there are no recognizable names, return an empty response.\n\nText:\n"""\n${text}\n"""`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const extractedText = response.text;
        if (!extractedText.trim()) {
            return [];
        }

        return extractedText.trim().split('\n').map(name => name.trim()).filter(Boolean);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to extract names using AI. Please check the console for details.");
    }
};

export const isAIAvailable = (): boolean => !!ai;
