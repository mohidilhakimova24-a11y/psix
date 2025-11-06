import { GoogleGenAI, Type } from "@google/genai";
import { MoodResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const moodAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    mood: {
      type: Type.STRING,
      description: "Foydalanuvchi kayfiyatini tasvirlaydigan bitta so'z (masalan, Xursand, O'ychan, G'ayratli).",
    },
    description: {
      type: Type.STRING,
      description: "Ushbu kayfiyat bilan bog'liq qisqa, tushunarli va ijobiy jumla.",
    },
    colorHex: {
      type: Type.STRING,
      description: "Kayfiyatni vizual tarzda ifodalovchi hex rang kodi (masalan, #FFD700).",
    },
  },
  required: ['mood', 'description', 'colorHex'],
};

export const analyzeMood = async (selections: string[]): Promise<MoodResult> => {
  const prompt = `Siz sezgir psixologsiz. Foydalanuvchi mavhum san'at asarlariga javoban bir qator so'zlarni tanladi. Tanlangan so'zlar: [${selections.join(', ')}]. Shu so'zlarga asoslanib, uning eng ehtimoliy emotsional holatini aniqlang. FAQAT JSON obyektida javob bering. Javob o'zbek tilida bo'lishi kerak. JSON taqdim etilgan sxemaga mos kelishi kerak.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: moodAnalysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation
    if (result.mood && result.description && result.colorHex) {
      return result as MoodResult;
    } else {
      throw new Error("API'dan noto'g'ri JSON formati qabul qilindi.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Kayfiyatni tahlil qilib bo'lmadi. Iltimos, keyinroq qayta urinib ko'ring.");
  }
};
