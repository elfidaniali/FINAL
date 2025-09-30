
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DomainStatus } from '../types';

if (!process.env.API_KEY) {
  console.warn("Gemini API key is not set in environment variables. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const checkDomainHealthWithGemini = async (domainUrl: string): Promise<{ status: DomainStatus; notes: string }> => {
  if (!process.env.API_KEY) {
    return {
      status: DomainStatus.Healthy,
      notes: "AI check skipped: API key not configured. Defaulting to healthy.",
    };
  }

  const prompt = `Analyze the domain "${domainUrl}" for potential risks. Is it more likely to be 'healthy', 'down' (e.g., parked, unavailable), or 'flagged' (e.g., suspicious, malicious, spammy)? Respond with only one word: healthy, down, or flagged. Then, on a new line, provide a brief one-sentence justification.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text.trim();
    const [statusStr, ...notesArr] = text.split('\n');
    const notes = notesArr.join(' ').trim();
    
    let status: DomainStatus;
    switch (statusStr.toLowerCase().trim()) {
      case 'healthy':
        status = DomainStatus.Healthy;
        break;
      case 'down':
        status = DomainStatus.Down;
        break;
      case 'flagged':
        status = DomainStatus.Flagged;
        break;
      default:
        status = DomainStatus.Healthy; // Default to healthy on unexpected response
    }
    
    return { status, notes: `AI Analysis: ${notes || 'No specific notes provided.'}` };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      status: DomainStatus.Healthy, // Fail-safe to healthy
      notes: "AI check failed due to an API error.",
    };
  }
};
