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
      prompt += ` The candidate has ${experienceCount} years of relevant experience.`;
    } else {
      prompt += ` This is an entry-level position seeker with foundational skills.`;
    }

    prompt += `\n\nGuidelines:\n- Focus on highlighting professional strengths, adaptability, and value contribution based on the provided skills and role.\n- Use active, confident language.\n- Avoid generic clichés like "hard worker", "team player", etc.\n- Do not include introductory phrases or sentences about the nature of the document being generated.\n- Match the professional tone to the target role and emphasize how the candidate's skills align with the role's requirements.\n- Use specific, quantifiable language where possible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Remove any introductory text that might have been generated
    let summary = response.text || '';
    const lines = summary.split('\n').filter(line => line.trim() !== '');

    // Look for and remove lines that start with common intro phrases
    const filteredLines = lines.filter(line => {
      const lower = line.toLowerCase().trim();
      return !(
        lower.startsWith('here\'s') ||
        lower.startsWith('here is') ||
        lower.startsWith('this is') ||
        lower.match(/compelling.*cv.*summary/i) ||
        lower.match(/professional.*summary/i)
      );
    });

    return filteredLines.join('\n').trim();
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

    let contextInstruction = '';
    if (type === 'project') {
      contextInstruction = `technical project description for a CV. Focus on the technologies used, the problem solved, scope, and measurable outcomes. Start with an action verb and quantify achievements where possible. Tailor the language to highlight technical and problem-solving skills relevant to the project.`;
    } else {
      contextInstruction = `CV experience bullet point. Use strong action verbs at the beginning, focus on professional responsibilities, quantifiable achievements, and specific results. Emphasize skills and outcomes that are most relevant to the position. Keep in an active voice and use metrics where available.`;
    }

    const prompt = `As a professional CV writer, rewrite the following ${contextInstruction} in ${langName} to be more professional, impactful, and relevant. Make the language natural and compelling while staying concise. Only return the enhanced version without any introductory text.

    Original text: "${text}"

    Enhanced version:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Remove any introductory text that might have been generated
    let enhanced = response.text || text;
    const lines = enhanced.split('\n').filter(line => line.trim() !== '');

    // Look for and remove lines that start with common intro phrases
    const filteredLines = lines.filter(line => {
      const lower = line.toLowerCase().trim();
      return !(
        lower.startsWith('here\'s') ||
        lower.startsWith('here is') ||
        lower.startsWith('this is') ||
        lower.match(/enhanced.*description/i) ||
        lower.match(/revised.*description/i)
      );
    });

    return filteredLines.join('\n').trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to enhance text.");
  }
};

export const suggestSkills = async (jobTitle: string, language: Language): Promise<string[]> => {
  if (!apiKey) return [];

  try {
    const langName = getLanguageName(language);
    const prompt = `As a professional career advisor, suggest 8-12 highly relevant hard and soft skills for a "${jobTitle}" role in ${langName}. Consider both technical requirements and soft skills that employers typically value for this position. Return ONLY a JSON array of strings with no additional text. Example: ["Skill 1", "Skill 2"]`;

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