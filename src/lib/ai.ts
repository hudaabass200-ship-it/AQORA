import { GoogleGenAI, Type } from "@google/genai";

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

جدول تغذية أسماك البلطي (مرجع أساسي - Skretting):
يجب أن يكون هذا الجدول هو مرجعك الأول والأساسي عند الإجابة على أي استفسارات تخص تغذية البلطي. التزم به بدقة وبسّط الأرقام للمزارع:
- من 0 إلى 1 جرام: التغذية 8 مرات يومياً. المنتج: Nutra 0. معدل التغذية: يبدأ من 42% وينخفض إلى 8.5% من وزن الجسم.
- من 1 إلى 10 جرام: التغذية 4 مرات يومياً. المنتجات: Nutra 80 (حتى 1.1 جرام) ثم Nutra 120 (حتى 10 جرام). معدل التغذية: ينخفض تدريجياً من 8.5% إلى 7.0%.
- من 10 إلى 35 جرام: المنتج: Nutra 160. معدل التغذية: ينخفض من 7.0% إلى 5.3%.
- من 37 إلى 60 جرام: المنتج: Optiline 2.0. معدل التغذية: ينخفض من 5.2% إلى 4.9%.
- من 62 إلى 184 جرام: المنتج: Optiline 3.0. معدل التغذية: ينخفض من 4.8% إلى 3.8%.
- من 190 إلى 521 جرام: المنتج: Optiline 4.5. معدل التغذية: ينخفض من 3.7% إلى 2.3%.
- من 530 إلى 1005 جرام: المنتج: Optiline 6.0. معدل التغذية: ينخفض من 2.3% إلى 1.15%.
إذا سألك المزارع عن كمية العلف لوزن معين، ابحث في هذا الجدول وأعطه الإجابة المباشرة (المنتج المناسب ونسبة التغذية من وزن الجسم) ولا تعتمد على معلوماتك العامة.

قواعد الإجابة:
1. لا تعتمد على معلوماتك العامة، بل قم بطلب تحديث البيانات من هذه الأدوات أولاً (إلا في حالة تغذية البلطي، فاعتمد على الجدول المذكور أعلاه).
2. اذكر دائماً "المصدر" الذي حصلت منه على المعلومة في نهاية إجابتك (مثال: المصدر: FishWatch API أو جدول Skretting).
3. بسّط المصطلحات العلمية المعقدة لتناسب المزارع البسيط.
4. ركز دائماً على تقديم نصائح عملية (درجات الحرارة المناسبة، نوع الغذاء، الإنتاجية المتوقعة).`;

export const FISH_FARMING_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "getFishSpeciesInfo",
        description: "Fetch real-time data about fish species (nutrition, environment, etc.) from FishWatch API.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            speciesName: {
              type: Type.STRING,
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
          type: Type.OBJECT,
          properties: {},
        }
      },
      {
        name: "getFishTaxonomy",
        description: "Fetch scientific taxonomy and species data from Fish Species API.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            speciesName: {
              type: Type.STRING,
              description: "The name of the fish species in English."
            }
          },
          required: ["speciesName"]
        }
      }
    ]
  }
];
