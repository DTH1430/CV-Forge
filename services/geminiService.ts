import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key exists
export const hasApiKey = (): boolean => !!apiKey;

const getLanguageName = (lang: Language) => lang === 'vi' ? 'Vietnamese' : 'English';

export interface SummaryContext {
  jobTitle?: string;
  skills?: string[];
  experienceCount?: number;
}

export const generateSummary = async (context: SummaryContext, language: Language): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure your environment.";

  try {
    const langName = getLanguageName(language);
    const { jobTitle, skills = [], experienceCount = 0 } = context;

    let prompt = `Act as a professional CV writer. Write a compelling, professional CV summary (approx. 3-4 sentences) in ${langName}.`;
    
    if (jobTitle) {
      prompt += ` The candidate's target or most recent role is "${jobTitle}".`;
    } else {
      prompt += ` The candidate is a professional seeking opportunities.`;
    }

    if (skills.length > 0) {
      prompt += ` Key skills include: ${skills.join(', ')}.`;
    }

    if (experienceCount > 0) {
      prompt += ` The candidate has listed ${experienceCount} previous roles, indicating significant experience.`;
    } else {
      prompt += ` This appears to be an entry-level or early career profile.`;
    }

    prompt += `\n\nGuidelines:\n- Focus on highlighting professional strengths, adaptability, and value contribution based on the provided skills and role.\n- Use active, confident language.\n- Avoid generic clichés.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary.");
  }
};

export const enhanceDescription = async (text: string, language: Language, type: 'experience' | 'project' = 'experience'): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  if (!text) return "";

  try {
    const langName = getLanguageName(language);
    
    const contextInstruction = type === 'project' 
      ? "technical project description. Focus on the technologies used, the problem solved, scope, and the measurable outcome."
      : "CV experience bullet point. Focus on professional responsibilities, action verbs, and quantifiable achievements.";

    const prompt = `Rewrite the following ${contextInstruction} in ${langName} to be more professional, clear, and impactful. Keep it concise.
    
    Original text: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to enhance text.");
  }
};

export const suggestSkills = async (jobTitle: string, language: Language): Promise<string[]> => {
  if (!apiKey) return [];

  try {
    const langName = getLanguageName(language);
    const prompt = `List 10 relevant hard and soft skills for a ${jobTitle} in ${langName}. Return ONLY a JSON array of strings. Example: ["Skill 1", "Skill 2"]`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};