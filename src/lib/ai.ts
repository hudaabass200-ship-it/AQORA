import { GoogleGenAI } from "@google/genai";

export const getApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY3 || "";
};

export const getAIClient = () => {
  const key = getApiKey();
  return key ? new GoogleGenAI({ apiKey: key }) : null;
};

export const FISH_FARMING_SYSTEM_INSTRUCTION = `أنت مساعد ذكي متخصص في دعم مزارعي الأسماك (خاصة البلطي، القاروص، والدنيس). دورك هو تقديم معلومات دقيقة ومبنية على بيانات علمية.
يجب عليك تفعيل واستخدام خاصية Function Calling للوصول إلى البيانات اللحظية من الروابط التالية عند الإجابة على أي سؤال يخص استزراع الأسماك أو الإنتاج:
- FishWatch API: للحصول على معلومات التغذية والبيئة.
- World Bank API: للحصول على إحصائيات إنتاج مصر.
- Fish Species API: للتصنيفات العلمية والاسم العلمي.

هام جداً للبحث:
عندما يسألك المستخدم باللغة العربية عن أسماك معينة، يجب عليك ترجمة اسم السمكة إلى الإنجليزية قبل تمريرها إلى الدوال (Functions):
- البلطي = Tilapia
- القاروص = Sea Bass
- الدنيس = Sea Bream (أو Gilthead seabream)

قواعد الإجابة:
1. لا تعتمد على معلوماتك العامة، بل قم بطلب تحديث البيانات من هذه الأدوات أولاً.
2. اذكر دائماً "المصدر" الذي حصلت منه على المعلومة في نهاية إجابتك (مثال: المصدر: FishWatch API أو Fish Species API).
3. بسّط المصطلحات العلمية المعقدة لتناسب المزارع البسيط.
4. ركز دائماً على تقديم نصائح عملية (درجات الحرارة المناسبة، نوع الغذاء، الإنتاجية المتوقعة).`;

export const FISH_FARMING_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "getFishSpeciesInfo",
        description: "Fetch real-time data about fish species (nutrition, environment, etc.) from FishWatch API.",
        parameters: {
          type: "OBJECT",
          properties: {
            speciesName: {
              type: "STRING",
              description: "The name of the fish species in English (e.g., 'tilapia', 'sea bass', 'sea bream')."
            }
          },
          required: ["speciesName"]
        }
      },
      {
        name: "getEgyptAquacultureProduction",
        description: "Fetch real-time aquaculture production statistics for Egypt from the World Bank API.",
        parameters: {
          type: "OBJECT",
          properties: {},
        }
      },
      {
        name: "getFishTaxonomy",
        description: "Fetch scientific taxonomy and species data from Fish Species API.",
        parameters: {
          type: "OBJECT",
          properties: {
            speciesName: {
              type: "STRING",
              description: "The name of the fish species in English."
            }
          },
          required: ["speciesName"]
        }
      }
    ]
  }
];
