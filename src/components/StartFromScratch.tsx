import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sprout, Box, Layers, Map, Zap, TrendingUp, Leaf, Loader2, BookOpen, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAIClient, FISH_FARMING_SYSTEM_INSTRUCTION } from "../lib/ai";

type PondType = "ترابي" | "خرساني" | "أسمنتي";
type SystemType = "مكثف" | "شبه مكثف" | "غير مكثف";

const POND_TYPES: { id: PondType; label: string; icon: any; desc: string }[] = [
  { id: "ترابي", label: "حوض ترابي", icon: Map, desc: "أحواض محفورة في الأرض الطبيعية، الأقل تكلفة في الإنشاء." },
  { id: "خرساني", label: "حوض خرساني", icon: Box, desc: "أحواض مبنية من الخرسانة المسلحة، قوية وتدوم طويلاً." },
  { id: "أسمنتي", label: "حوض أسمنتي", icon: Layers, desc: "أحواض مبنية بالطوب ومحارة أسمنتية، تكلفة متوسطة." },
];

const SYSTEM_TYPES: { id: SystemType; label: string; icon: any; desc: string }[] = [
  { id: "مكثف", label: "نظام مكثف", icon: Zap, desc: "كثافة سمكية عالية جداً، إنتاجية قصوى، يتطلب تهوية وفلترة مستمرة." },
  { id: "شبه مكثف", label: "نظام شبه مكثف", icon: TrendingUp, desc: "كثافة متوسطة، يعتمد جزئياً على الغذاء الطبيعي والأعلاف." },
  { id: "غير مكثف", label: "نظام غير مكثف", icon: Leaf, desc: "كثافة منخفضة، يعتمد بشكل أساسي على الغذاء الطبيعي في الحوض." },
];

export default function StartFromScratch() {
  const [pondType, setPondType] = useState<PondType | null>(null);
  const [systemType, setSystemType] = useState<SystemType | null>(null);
  
  const [guideContent, setGuideContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateGuide = async () => {
    if (!pondType || !systemType) return;
    
    setIsLoading(true);
    setError("");
    setGuideContent("");

    const ai = getAIClient();

    if (!ai) {
      setError("⚠️ مفتاح الذكاء الاصطناعي (API Key) غير متوفر. يرجى إضافته من صفحة الإعدادات.");
      setIsLoading(false);
      return;
    }

    try {
      const prompt = `أنا مبتدئ في الاستزراع السمكي وأريد أن أبدأ من الصفر.
لقد اخترت المواصفات التالية لمشروعي:
- نوع الحوض: ${pondType}
- نظام الاستزراع: ${systemType}

أريد دليلاً شاملاً ومفصلاً خطوة بخطوة للبدء، يشمل:
1. مميزات وعيوب هذا المزيج (حوض ${pondType} مع نظام ${systemType}).
2. التجهيزات المطلوبة قبل وضع الأسماك (التهوية، الفلاتر، تجهيز القاع/الجدران).
3. معالجة وتجهيز المياه.
4. اختيار الزريعة المناسبة وكثافة الاستزراع الموصى بها.
5. نظام التغذية المناسب.
6. أهم التحديات التي ستواجهني وكيفية التغلب عليها.

اكتب الدليل باللغة العربية، ونسقه بشكل جميل باستخدام العناوين العريضة (Markdown) والنقاط الواضحة.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: FISH_FARMING_SYSTEM_INSTRUCTION,
        }
      });
      
      setGuideContent(response.text || "");
    } catch (err) {
      console.error("Guide generation error:", err);
      setError("حدث خطأ أثناء إنشاء الدليل. تأكد من اتصالك بالإنترنت أو صلاحية مفتاح API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-emerald-600" />
          كيف تبدأ من الصفر؟
        </h2>
        <p className="text-slate-600">
          حدد نوع الحوض المتاح لديك ونظام الاستزراع الذي تستهدفه، وسنقوم بإنشاء دليل مخصص لك خطوة بخطوة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Pond Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
            اختر نوع الحوض
          </h3>
          <div className="space-y-3">
            {POND_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = pondType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setPondType(type.id)}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                    isSelected 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${isSelected ? "text-blue-900" : "text-slate-700"}`}>{type.label}</h4>
                    <p className={`text-sm mt-1 ${isSelected ? "text-blue-700" : "text-slate-500"}`}>{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: System Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
            اختر نظام الاستزراع
          </h3>
          <div className="space-y-3">
            {SYSTEM_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = systemType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSystemType(type.id)}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                    isSelected 
                      ? "border-emerald-500 bg-emerald-50" 
                      : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${isSelected ? "text-emerald-900" : "text-slate-700"}`}>{type.label}</h4>
                    <p className={`text-sm mt-1 ${isSelected ? "text-emerald-700" : "text-slate-500"}`}>{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generate Action */}
      <div className="flex flex-col items-center justify-center mt-8">
        <button
          onClick={generateGuide}
          disabled={!pondType || !systemType || isLoading}
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              جاري إعداد الدليل المخصص...
            </>
          ) : (
            <>
              <BookOpen className="w-6 h-6" />
              إنشاء الدليل الشامل
            </>
          )}
        </button>
        
        {(!pondType || !systemType) && (
          <p className="text-slate-500 text-sm mt-3">
            الرجاء اختيار نوع الحوض ونظام الاستزراع أولاً
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100 max-w-3xl mx-auto mt-8">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Result Guide */}
      <AnimatePresence>
        {guideContent && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Sprout className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">دليلك المخصص للبدء</h3>
                <p className="text-slate-500 mt-1">
                  حوض {pondType} • نظام {systemType}
                </p>
              </div>
            </div>
            
            <div className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-blue-600 prose-li:marker:text-blue-500 prose-img:rounded-xl" dir="rtl">
              <ReactMarkdown>{guideContent}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
