
import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult, TranslationResult, VisionDetectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const detectLanguage = async (text: string): Promise<DetectionResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following text and detect its language, dialect, and confidence level. Provide a brief linguistic summary: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedLanguage: { type: Type.STRING, description: "Full name of the language" },
          isoCode: { type: Type.STRING, description: "ISO 639-1 code" },
          confidence: { type: Type.NUMBER, description: "Value between 0 and 1" },
          dialect: { type: Type.STRING, description: "Specific dialect if detectable, otherwise null" },
          isReliable: { type: Type.BOOLEAN, description: "True if confidence is high" },
          alternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              }
            }
          },
          summary: { type: Type.STRING, description: "Short context or interesting fact about the detected language/dialect" }
        },
        required: ["detectedLanguage", "isoCode", "confidence", "isReliable", "alternatives", "summary"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const translateText = async (text: string, targetLanguage: string): Promise<TranslationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following text to ${targetLanguage}: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translatedText: { type: Type.STRING },
          targetLanguage: { type: Type.STRING }
        },
        required: ["translatedText", "targetLanguage"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const detectFromImage = async (base64Image: string): Promise<VisionDetectionResult> => {
  // Remove header if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001', // Using stable 2.0 Flash
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Analyze the text in this image. 
                    1. OCR the text.
                    2. Detect the language.
                    3. Translate each distinct text block to English.
                    4. Return bounding boxes for each block in [ymin, xmin, ymax, xmax] format (normalized 0-1000).
                    
                    Return a JSON object with this schema:
                    {
                        "detectedLanguage": "Main language detected",
                        "overallConfidence": 0.0 to 1.0,
                        "summary": "Brief description of what is in the image (e.g. 'A street sign in Tokyo')",
                        "blocks": [
                            {
                                "box_2d": [ymin, xmin, ymax, xmax],
                                "text": "Original text in this block",
                                "translatedText": "English translation",
                                "language": "Language of this block"
                            }
                        ]
                    }` },
          { inlineData: { mimeType: "image/jpeg", data: base64Data } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedLanguage: { type: Type.STRING },
          overallConfidence: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          blocks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                box_2d: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER }
                },
                text: { type: Type.STRING },
                translatedText: { type: Type.STRING },
                language: { type: Type.STRING }
              }
            }
          }
        },
        required: ["detectedLanguage", "blocks", "summary"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
