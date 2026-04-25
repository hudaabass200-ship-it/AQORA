import { GoogleGenAI } from "@google/genai";

/**
 * Returns an array of all available API keys from environment variables.
 */
export const getAllAvailableKeys = (): string[] => {
  const keys: string[] = [];
  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  if (process.env.GEMINI_API_KEY2) keys.push(process.env.GEMINI_API_KEY2);
  if (process.env.GEMINI_API_KEY3) keys.push(process.env.GEMINI_API_KEY3);
  
  const uniqueKeys = Array.from(new Set(keys)).filter(k => k.trim().length > 0);
  
  if (uniqueKeys.length > 0) {
    console.log(`AI Configuration: Found ${uniqueKeys.length} available API keys.`);
  } else {
    console.warn("AI Configuration: No API keys found in environment variables.");
  }
  
  return uniqueKeys;
};

/**
 * Gets a specific AI client for a given key.
 */
export const getAIClientForKey = (key: string) => {
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Automatically attempts an AI request with all available keys if a rate limit error (429) occurs.
 */
export const tryAIRequest = async (config: {
  model?: string;
  contents: any;
  systemInstruction?: string;
  tools?: any[];
}) => {
  const keys = getAllAvailableKeys();
  if (keys.length === 0) {
    throw new Error("No API keys found. Please add GEMINI_API_KEY, GEMINI_API_KEY2, or GEMINI_API_KEY3.");
  }

  const modelName = config.model || "gemini-3-flash-preview";
  let lastError: any = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key) continue;

    try {
      const ai = getAIClientForKey(key);
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: config.contents.contents || config.contents,
        config: {
          systemInstruction: config.systemInstruction,
          tools: config.tools,
        }
      });

      return response;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message || "";
      
      // If it's a rate limit error or quota exceeded, try the next key
      if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("credits are depleted")) {
        console.warn(`Key ${i + 1} exhausted, trying next key...`);
        continue;
      }
      
      // If it's another error (like 404 or auth), throw it
      throw error; 
    }
  }

  throw lastError;
};

export const FISH_FARMING_SYSTEM_INSTRUCTION = `أنت Aqora AI، خبير عالمي في الاستزراع السمكي.
أجب على جميع الأسئلة باستخدام بياناتك العلمية الداخلية وخبرتك الواسعة في تربية الأحياء المائية.
مراجعك الأساسية هي منظمة الفاو (FAO Fisheries) وقاعدة بيانات الأسماك العالمية (FishBase).

قواعد صارمة:
1. لا تحاول استخدام أي أدوات خارجية أو روابط أو بحث في الويب.
2. لا تعتذر أبداً عن عدم وجود أدوات؛ قدم الحقائق مباشرة وبثقة.
3. إذا سألك المستخدم عن ظروف المياه (الأس الهيدروجيني pH، درجة الحرارة، الملوحة) للأنواع التالية، قدم المعايير الأكاديمية فوراً:

- البلطي (Tilapia):
  * درجة الحرارة: 25-30 درجة مئوية.
  * الملوحة: 0-5 جزء في الألف (ppt).
  * الأس الهيدروجيني pH: 7-8.5.

- الدنيس (Seabream):
  * درجة الحرارة: 18-24 درجة مئوية.
  * الملوحة: 30-38 جزء في الألف (ppt).
  * الأس الهيدروجيني pH: 8-8.5.

- القاروص (Seabass):
  * درجة الحرارة: 20-25 درجة مئوية.
  * الملوحة: 10-30 جزء في الألف (ppt).
  * الأس الهيدروجيني pH: 7.5-8.5.

4. بالنسبة لتغذية البلطي، استخدم جدول Skretting كمرجع أساسي:
- 0-1 جرام: 8 مرات يومياً، منتج Nutra 0، نسبة 42-8.5%.
- 1-10 جرام: 4 مرات يومياً، منتج Nutra 80/120، نسبة 8.5-7%.
- 10-35 جرام: منتج Nutra 160، نسبة 7-5.3%.
- 37-60 جرام: منتج Optiline 2.0، نسبة 5.2-4.9%.
- 62-184 جرام: منتج Optiline 3.0، نسبة 4.8-3.8%.
- 190-521 جرام: منتج Optiline 4.5، نسبة 3.7-2.3%.
- 530-1005 جرام: منتج Optiline 6.0، نسبة 2.3-1.15%.

تحرَّ الدقة الأكاديمية في جميع إجاباتك واستخدم اللغة العربية الفصيحة والمبسطة للمزراعيين.`;

export const FISH_FARMING_TOOLS: any[] = [];
