import { useState } from "react";
import { Newspaper, Loader2, AlertCircle, ChevronDown, Droplets, Wheat, Stethoscope, Lightbulb, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { getAIClient, FISH_FARMING_SYSTEM_INSTRUCTION } from "../lib/ai";

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
    if (openCategory === id) {
      setOpenCategory(null);
      return;
    }
    
    setOpenCategory(id);

    if (categoryData[id]?.content || categoryData[id]?.isLoading) return;

    setCategoryData(prev => ({ ...prev, [id]: { content: "", isLoading: true, error: "" } }));

    const ai = getAIClient();

    if (!ai) {
      setCategoryData(prev => ({ 
        ...prev, 
        [id]: { content: "", isLoading: false, error: "مفتاح API غير متوفر. يرجى إضافته من صفحة الإعدادات." } 
      }));
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: FISH_FARMING_SYSTEM_INSTRUCTION,
        }
      });
      setCategoryData(prev => ({ 
        ...prev, 
        [id]: { content: response.text || "", isLoading: false, error: "" } 
      }));
    } catch (err: any) {
      console.error("Error fetching updates:", err);
      const errorMsg = err.message || "حدث خطأ غير معروف";
      let friendlyError = `خطأ في الاتصال: ${errorMsg}.`;
      
      if (errorMsg.includes("404") || errorMsg.includes("NOT_FOUND")) {
        friendlyError = "خطأ 404: المحرك غير موجود. تأكد من إضافة GEMINI_API_KEY في إعدادات Vercel قبل الرفع.";
      }

      setCategoryData(prev => ({ 
        ...prev, 
        [id]: { 
          content: "", 
          isLoading: false, 
          error: friendlyError
        } 
      }));
    }
  };

  const getCategoryColor = (id: string) => {
    switch (id) {
      case 'water': return 'bg-blue-50 text-primary';
      case 'feed': return 'bg-secondary-container/20 text-secondary';
      case 'disease': return 'bg-error-container/30 text-error';
      case 'breeding': return 'bg-tertiary-fixed text-primary';
      default: return 'bg-primary-container text-on-primary-container';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Hero Section: Editorial Style */}
      <section className="relative overflow-hidden rounded-[2rem] bg-surface-container-low p-6 md:p-8">
        <div className="relative z-10 max-w-[80%]">
          <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold mb-3 tracking-wide">جديد اليوم</span>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-2 leading-tight">أحدث التطورات</h2>
          <p className="text-tertiary text-sm md:text-base leading-relaxed mb-4">
            اختر القسم الذي تود قراءته للتعرف على أحدث التقنيات والأخبار العالمية والمحلية بضغطة زر.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-0 w-full h-full opacity-20 pointer-events-none">
          <img 
            alt="Background Texture" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRnjJ9eBh20WKWbZ1WLRpd8P2E6ZWSL30KztYtDUBxGZR8XTKxizQemxIXaGW2Zyh_020wtOw7QUeqKnxSCW0bzv-8X28ycDYfRKu_YrSnq_pnN7uVeqsaEo8x8ffdoh9KgeGCUbywTnsuZSRVXhsIsuyfOjoI54HWuxn2dgtLvcJHZSDZRfLKqp8NRFxz-cdsdhOYuBMw9mJATL9TdnYocQtaDpXOnFM76lhkqE_sXxrGP1sugqoCtxzvjozTCkyC74E1ZC9vQyw"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <div className="space-y-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isOpen = openCategory === cat.id;
          const data = categoryData[cat.id];

          return (
            <div key={cat.id} className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden group">
              <button
                onClick={() => handleToggle(cat.id, cat.prompt)}
                className="w-full p-5 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${getCategoryColor(cat.id)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-on-surface">{cat.title}</h3>
                    <p className="text-xs text-tertiary">انقر للقراءة</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-outline-variant" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-outline-variant rtl:-scale-x-100" />
                )}
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
                    <div className="p-6 md:p-8 border-t border-outline-variant/10 bg-surface-container-low/30">
                      {data?.isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                          <p className="text-tertiary font-medium animate-pulse font-body">جاري جلب أحدث المعلومات...</p>
                        </div>
                      ) : data?.error ? (
                        <div className="bg-error-container/30 border border-error/20 text-error p-4 rounded-xl flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="font-body text-sm">{data.error}</p>
                        </div>
                      ) : data?.content ? (
                        <div className="prose prose-slate prose-blue max-w-none prose-headings:font-headline prose-headings:font-bold prose-headings:text-on-surface prose-p:font-body prose-p:text-on-surface-variant prose-a:text-primary prose-li:marker:text-primary" dir="rtl">
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
