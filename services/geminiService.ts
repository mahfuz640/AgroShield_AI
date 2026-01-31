
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { DiagnosticMode, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeImage = async (
  base64Image: string,
  mode: DiagnosticMode
): Promise<AnalysisResult> => {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = mode === DiagnosticMode.LEAF 
    ? "You are an expert plant pathologist and agronomist. Your goal is to identify crop diseases from leaf images."
    : "You are a specialized avian veterinarian. Your goal is to identify poultry diseases from images of chickens.";

  const prompt = mode === DiagnosticMode.LEAF
    ? `Analyze this leaf image. Identify if the plant is healthy or diseased. 
       If diseased, provide the specific name, symptoms visible, immediate treatment, and prevention.
       If healthy, state it is healthy and provide general maintenance tips.
       Use Google Search to ensure the latest treatment protocols are provided.`
    : `Analyze this poultry/chicken image. Identify if the bird is healthy or shows signs of disease.
       If diseased, identify the potential disease (e.g., Newcastle, Marek's, Coccidiosis), symptoms, isolation protocols, and treatment.
       Use Google Search for the most current veterinary guidelines.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.STRING },
          symptoms: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          treatment: { type: Type.STRING },
          prevention: { type: Type.STRING },
          isHealthy: { type: Type.BOOLEAN }
        },
        required: ["diseaseName", "confidence", "symptoms", "treatment", "prevention", "isHealthy"]
      }
    },
  });

  const rawText = response.text;
  const data = JSON.parse(rawText);
  
  // Extract grounding links if available
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const links = groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Related Resource',
    uri: chunk.web?.uri
  })).filter((link: any) => link.uri);

  return {
    ...data,
    groundingLinks: links
  };
};
