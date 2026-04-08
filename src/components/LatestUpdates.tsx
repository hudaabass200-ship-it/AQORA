import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Newspaper, Loader2, AlertCircle, ChevronDown, Droplets, Wheat, Stethoscope, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

// Use the new API key if available, otherwise fallback to the default one
const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const CATEGORIES = [
  { 
    id: 'water', 
    title: 'تكنولوجيا المياه وجودتها', 
    icon: Droplets, 
    prompt: 'أعطني أحدث التطورات والتقنيات الحديثة في مجال تكنولوجيا المياه وجودتها في الاستزراع السمكي (خاصة البلطي، القاروص، والدنيس) في مصر والعالم. ركز على أنظمة الفلترة، إعادة التدوير (RAS)، والتحكم في الأمونيا والأكسجين. نسق الإجابة في نقاط واضحة ومختصرة.' 
  },
  { 
    id: 'feed', 
    title: 'الأعلاف والتغذية البديلة', 
    icon: Wheat, 
    prompt: 'أعطني أحدث التطورات في مجال أعلاف وتغذية الأسماك (البلطي، القاروص، الدنيس). ركز على بدائل مسحوق السمك (مثل الحشرات والبروتين النباتي)، الأعلاف الوظيفية، وتقليل تكلفة التغذية. نسق الإجابة في نقاط واضحة ومختصرة.' 
  },
  { 
    id: 'disease', 
    title: 'الأمراض والمناعة', 
    icon: Stethoscope, 
    prompt: 'أعطني أحدث التطورات في تشخيص وعلاج أمراض الأسماك (البلطي، القاروص، الدنيس) وطرق رفع المناعة. ركز على اللقاحات، البروبيوتيك، والوقاية من الأمراض الشائعة في مصر. نسق الإجابة في نقاط واضحة ومختصرة.' 
  },
  { 
    id: 'breeding', 
    title: 'تقنيات التربية الحديثة', 
    icon: Lightbulb, 
    prompt: 'أعطني أحدث التقنيات في طرق التربية وإدارة المزارع السمكية. ركز على تكنولوجيا البيوفلوك (Biofloc)، الاستزراع التكاملي (Aquaponics)، وتطبيقات إنترنت الأشياء (IoT) والذكاء الاصطناعي في المزارع. نسق الإجابة في نقاط واضحة ومختصرة.' 
  }
];

export default function LatestUpdates() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Record<string, { content: string, isLoading: boolean, error: string }>>({});

  const handleToggle = async (id: string, prompt: string) => {
    // Toggle close if already open
    if (openCategory === id) {
      setOpenCategory(null);
      return;
    }
    
    // Open the selected category
    setOpenCategory(id);

    // If data is already fetched or currently fetching, do nothing more
    if (categoryData[id]?.content || categoryData[id]?.isLoading) return;

    // Set loading state
    setCategoryData(prev => ({ ...prev, [id]: { content: "", isLoading: true, error: "" } }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      setCategoryData(prev => ({ 
        ...prev, 
        [id]: { content: response.text || "", isLoading: false, error: "" } 
      }));
    } catch (err) {
      console.error("Error fetching updates:", err);
      setCategoryData(prev => ({ 
        ...prev, 
        [id]: { content: "", isLoading: false, error: "حدث خطأ أثناء جلب التحديثات. تأكد من اتصالك بالإنترنت أو صلاحية مفتاح API." } 
      }));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-blue-600" />
          أحدث التطورات في الاستزراع
        </h2>
        <p className="text-slate-600">
          اختر القسم الذي تود قراءته للتعرف على أحدث التقنيات والأخبار العالمية والمحلية بضغطة زر.
        </p>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isOpen = openCategory === cat.id;
          const data = categoryData[cat.id];

          return (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button
                onClick={() => handleToggle(cat.id, cat.prompt)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{cat.title}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50">
                      {data?.isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                          <p className="text-slate-500 font-medium animate-pulse">جاري جلب أحدث المعلومات...</p>
                        </div>
                      ) : data?.error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p>{data.error}</p>
                        </div>
                      ) : data?.content ? (
                        <div className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-blue-600 prose-li:marker:text-blue-500" dir="rtl">
                          <ReactMarkdown>{data.content}</ReactMarkdown>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
