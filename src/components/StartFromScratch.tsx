import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, ThermometerSun, Timer, Waves, TrendingUp, Fish, Activity, ChevronDown, HelpCircle, Loader2, Sparkles, CheckCircle2, Camera } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { tryAIRequest } from "../lib/ai";

const FAQ_DATA = [
  {
    q: "ما هي التكلفة المبدئية لإنشاء مزرعة سمكية صغيرة؟",
    a: "تختلف التكلفة حسب النظام (مفتوح، شبه مغلق، أو مغلق RAS). النظام المفتوح (أحواض ترابية) هو الأقل تكلفة، بينما نظام RAS يتطلب استثماراً مبدئياً أعلى ولكنه يوفر في المياه والمساحة. يفضل البدء بحوض تجريبي صغير لتفادي المخاطر."
  },
  {
    q: "ما هي المساحة المطلوبة للبدء؟",
    a: "يمكنك البدء بمساحة صغيرة جداً (حتى فوق سطح المنزل أو في الحديقة) باستخدام خزانات بلاستيكية أو فايبرجلاس سعة 1-2 متر مكعب لتعلم الأساسيات، قبل التوسع لمساحات تجارية."
  },
  {
    q: "كيف أختار نوع السمك المناسب لمزرعتي؟",
    a: "يعتمد الاختيار على: درجة حرارة الجو في منطقتك، نوع المياه المتوفرة (عذبة أم مالحة)، ومدى خبرتك. البلطي هو الأفضل للمبتدئين في المياه العذبة لتحمله الظروف القاسية."
  },
  {
    q: "ما هي أهم المعدات التي أحتاجها في البداية؟",
    a: "تحتاج أساساً إلى: حوض التربية، مضخة مياه، مضخة هواء (أكسجين)، فلاتر (ميكانيكية وبيولوجية)، وأدوات قياس جودة المياه (pH، أمونيا، أكسجين ذائب، حرارة)."
  },
  {
    q: "كيف أحافظ على جودة المياه؟",
    a: "من خلال المراقبة اليومية لمستويات الأمونيا والـ pH، وتغيير جزء من المياه بانتظام (10-20% أسبوعياً حسب النظام)، والتأكد من عدم الإفراط في تقديم العلف لتجنب تلوث المياه."
  }
];

const INITIAL_FISH_DATA = [
  {
    id: "tilapia",
    name: "البلطي النيلي",
    badge: "سهل التربية",
    badgeColor: "bg-primary/10 text-primary",
    description: "سمكة \"شجاعة\" تتحمل نقص الأكسجين، اقتصادية جداً بسبب استهلاكها لأنواع مختلفة من العلف، ومقاومة عالية للأمراض.",
    temp: "25-30°C",
    time: "6-8 شهور للوصول للوزن التسويقي (350-500 جرام)",
    waterType: "مياه عذبة",
    salinity: "0-5 ppt",
    ph: "7-8.5",
    image: "https://i.postimg.cc/pdYHjxb8/Whats-App-Image-2026-04-15-at-9-34-25-PM.jpg",
    tips: [
      "تأكد من جودة التهوية خاصة في فصل الصيف.",
      "استخدم أعلاف بنسبة بروتين 25-30%.",
      "حافظ على كثافة التخزين المناسبة لتجنب الإجهاد."
    ]
  },
  {
    id: "seabream",
    name: "الدنيس",
    badge: "سمكة تصديرية",
    badgeColor: "bg-secondary-container text-on-secondary-container",
    description: "سمكة ذات قيمة اقتصادية وعالية جداً (تصديرية)، طعمها ممتاز، وتتطلب مياهاً ذات جودة عالية وأكسجين مرتفع دائماً.",
    temp: "18-24°C",
    time: "12-15 شهر للوصول لوزن التسويق (350-450جرام)",
    waterType: "مياه مالحة",
    salinity: "30-38 جزء في الألف",
    ph: "8-8.5",
    image: "https://i.postimg.cc/hjqFzXZQ/Whats-App-Image-2026-04-15-at-9-35-11-PM.jpg",
    tips: [
      "يحتاج إلى مياه عالية النقاوة وتغيير مستمر.",
      "يفضل استخدام أعلاف غنية بالبروتين البحري.",
      "حساس لتغيرات درجات الحرارة المفاجئة."
    ]
  },
  {
    id: "seabass",
    name: "القاروص",
    badge: "قيمة عالية",
    badgeColor: "bg-tertiary-container text-on-tertiary-container",
    description: "سمكة مفترسة (تحتاج بروتين عالي في العلف)، نموها بطيء لكن سعرها في السوق مرتفع جداً، وتعتبر من أفخر أنواع الأسماك البحرية.",
    temp: "20-25°C",
    time: "14-18 شهر للوصول لوزن التسويق (400-600 جرام)",
    waterType: "مياه مالحة / شروب",
    salinity: "10-30 جزء في الألف",
    ph: "7.5-8.5 (يحتاج لمياه قلوية قليلاً، حساس للإجهاد البيئي)",
    image: "https://i.postimg.cc/jdSp70cD/rhv-w.jpg",
    tips: [
      "يحتاج لأعلاف بنسبة بروتين تتجاوز 45%.",
      "يجب فرز الأسماك دورياً لتجنب الافتراس الداخلي.",
      "توفير تيار مائي جيد في الحوض."
    ]
  }
];

interface StartFromScratchProps {
  setActiveTab: (tab: any) => void;
}

export default function StartFromScratch({ setActiveTab }: StartFromScratchProps) {
  const [expandedFish, setExpandedFish] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [fishImages, setFishImages] = useState<Record<string, string>>({});

  const handleImageChange = (fishId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFishImages(prev => ({
          ...prev,
          [fishId]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Beginner Tool State
  const [farmingType, setFarmingType] = useState<string>("");
  const [pondType, setPondType] = useState<string>("");
  const [fishType, setFishType] = useState<string>("");
  const [landArea, setLandArea] = useState<number | "">("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedFish(prev => prev === id ? null : id);
  };

  const handleGenerateGuide = async () => {
    if (!farmingType || !pondType || !fishType || !landArea) return;
    
    setIsGenerating(true);
    setGeneratedGuide(null);
    
    try {
      const prompt = `أنا مزارع مبتدئ أريد البدء في الاستزراع السمكي. 
      لقد اخترت الإعدادات التالية:
      - نوع الاستزراع: ${farmingType}
      - نوع الحوض: ${pondType}
      - نوع السمك المربى: ${fishType}
      - مساحة الأرض المتوفرة: ${landArea} متر مربع
      
      المهمة المطلوبة:
      1. أعطني خطة عمل وخطوات تفصيلية من الصفر للبدء.
      2. احسب لي بناءً على مساحة الأرض (${landArea} م²) ونوع الاستزراع (${farmingType}) كم أحتاج من الزريعة (عدد الأسماك) في هذه المساحة.
      3. نسق الإجابة في خطوات واضحة ومبسطة باستخدام Markdown مع إبراز الفقرة الخاصة بحساب عدد الأسماك.`;

      const response = await tryAIRequest({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setGeneratedGuide(response.text || "عذراً، لم أتمكن من توليد الخطة. حاول مرة أخرى.");
    } catch (error: any) {
      console.error("Error generating guide:", error);
      const errorDetail = error.message || "فشل الاتصال بخدمة الذكاء الاصطناعي";
      
      let friendlyError = `حدث خطأ في الاتصال: ${errorDetail}.`;
      if (errorDetail.includes("404") || errorDetail.includes("NOT_FOUND")) {
        friendlyError = "خطأ 404: المحرك غير موجود. تأكد من إضافة GEMINI_API_KEY في Vercel ثم تذكر عمل 'Redeploy' في تبويب Deployments.";
      } else if (errorDetail.includes("API key")) {
        friendlyError = "خطأ في مفتاح API: تأكد من صحة المفتاح في Vercel ثم قم بعمل إعادة بناء (Redeploy).";
      } else if (errorDetail.includes("429") || errorDetail.includes("RESOURCE_EXHAUSTED") || errorDetail.includes("credits are depleted")) {
        friendlyError = "⚠️ الرصيد نفد في كل المفاتيح الـ 3 المتاحة. أضف مفتاحاً جديداً في GEMINI_API_KEY3 في Vercel ثم اضغط 'Redeploy'.";
      } else if (errorDetail.includes("No API keys")) {
        friendlyError = "⚠️ لم يتم العثور على أي مفاتيح API. يرجى إضافتها في Vercel لكي تعمل الأداة.";
      }
      
      setGeneratedGuide(friendlyError);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-20 pb-12">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] h-[400px] flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="cinematic wide shot of a peaceful aquaculture pond at sunrise" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWsVFv-b5yb5QVSe0IgkGFkpKlSfyBNQQeioZM15t47lE_B4xDGWmwFedEzNjHoGfn89R2jMKqUYyVTZ6dyNh8tGZDbtmgwTfG4FYZRwyt_6bq8usUn9jqwvtqnDwy_yn68iANwUDr4X7qP2zUqDa3RuSNJGdJNM3octgTPjzbZT5MuYjlopxuZS5Bxbv8XjwGxyFTqPyxyH6IjcoT0j0CmpWo5yyW4tExN2s9IRdIt1XWAN1iCccYj7ddg2dOS-06m2TJgxLHwsU" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
        </div>
        <div className="relative z-10 p-8 md:p-12 w-full max-w-2xl">
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-secondary-container text-on-secondary-container rounded-full">
            دليل المبتدئين
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 font-headline">
            كيف تبدأ مزرعتك السمكية من الصفر
          </h2>
          <p className="text-white/90 text-lg font-medium mb-6">
            تعلم أسرار الاستزراع المائي من اختيار الموقع حتى الحصاد الأول.
          </p>
          <button 
            onClick={() => document.getElementById('fish-types-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20"
          >
            ابدأ التعلم الآن
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Beginner Interactive Tool */}
      <section className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-[2.5rem] p-8 md:p-12 editorial-shadow border border-outline-variant/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-primary font-headline">أداة المزارع المبتدئ</h3>
            <p className="text-on-surface-variant mt-1">اختر إعدادات مزرعتك وسيقوم المستشار الذكي بإنشاء خطة مخصصة لك من الصفر.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Farming Type */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-on-surface">نوع الاستزراع</label>
            <select 
              value={farmingType}
              onChange={(e) => setFarmingType(e.target.value)}
              className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
            >
              <option value="" disabled>اختر نوع الاستزراع...</option>
              <option value="مكثف">مكثف (كثافة عالية، إنتاجية عالية)</option>
              <option value="شبه مكثف">شبه مكثف (متوازن)</option>
              <option value="غير مكثف">غير مكثف (طبيعي، كثافة منخفضة)</option>
              <option value="نظام مغلق RAS">نظام مغلق (RAS)</option>
              <option value="بيوفلوك">بيوفلوك</option>
            </select>
          </div>

          {/* Pond Type */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-on-surface">نوع الحوض</label>
            <select 
              value={pondType}
              onChange={(e) => setPondType(e.target.value)}
              className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
            >
              <option value="" disabled>اختر نوع الحوض...</option>
              <option value="ترابي">حوض ترابي</option>
              <option value="أسمنتي">حوض أسمنتي</option>
              <option value="فايبرجلاس">خزان فايبرجلاس / بلاستيك</option>
            </select>
          </div>

          {/* Fish Type */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-on-surface">نوع السمك المربى</label>
            <select 
              value={fishType}
              onChange={(e) => setFishType(e.target.value)}
              className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
            >
              <option value="" disabled>اختر نوع السمك...</option>
              <option value="البلطي النيلي">البلطي النيلي</option>
              <option value="الدنيس">الدنيس</option>
              <option value="القاروص">القاروص</option>
              <option value="البوري">البوري</option>
              <option value="الجمبري">الجمبري (روبيان)</option>
            </select>
          </div>

          {/* Land Area */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-on-surface">مساحة الأرض المتاحة (م²) </label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="مثال: 1000" 
                value={landArea}
                onChange={(e) => setLandArea(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow outline-none" 
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-outline">م²</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateGuide}
          disabled={!farmingType || !pondType || !fishType || !landArea || isGenerating}
          className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري إعداد الخطة المخصصة...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              إنشاء خطة البدء
            </>
          )}
        </button>

        <AnimatePresence>
          {generatedGuide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-outline-variant/30"
            >
              <div className="bg-surface rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-sm">
                <div className="prose prose-slate max-w-none prose-headings:text-primary prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary-container prose-strong:text-on-surface prose-ul:text-on-surface-variant prose-p:text-on-surface-variant" dir="rtl">
                  <ReactMarkdown>{generatedGuide}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Fish Types Editorial Grid */}
      <section id="fish-types-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-extrabold text-primary mb-2 font-headline">أنواع الأسماك وبياناتها</h3>
            <p className="text-on-surface-variant max-w-md">تعرف على الخصائص العلمية والبيئية لكل نوع لاختيار الأنسب لمزرعتك.</p>
          </div>
          <div className="flex gap-2" dir="ltr">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors">
              <ChevronLeft className="w-6 h-6 text-on-surface" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-container transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_FISH_DATA.map((fish) => (
            <div key={fish.id} className="fish-card group relative bg-surface-container-lowest rounded-[2rem] overflow-hidden editorial-shadow transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/3] w-full overflow-hidden relative group/image bg-surface-container">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={fish.name} 
                  src={fishImages[fish.id] || fish.image} 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).classList.add('opacity-0');
                    (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[img.opacity-0]:opacity-100 pointer-events-none">
                  <Fish className="w-12 h-12 text-primary/20" />
                </div>
                <label className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/image:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                  <Camera className="w-5 h-5 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageChange(fish.id, e)} 
                  />
                </label>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-primary font-headline">{fish.name}</h4>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${fish.badgeColor}`}>{fish.badge}</span>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  {fish.description}
                </p>
                
                {/* Basic Stats */}
                <div className="flex flex-wrap items-center gap-2 text-primary/80 mb-6">
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
                    <ThermometerSun className="w-4 h-4" />
                    <span className="text-xs font-bold">{fish.temp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-bold">{fish.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
                    <Waves className="w-4 h-4" />
                    <span className="text-xs font-bold">{fish.waterType}</span>
                  </div>
                </div>

                {/* Expandable Details */}
                <button 
                  onClick={() => toggleExpand(fish.id)}
                  className="learn-more-link text-primary text-sm font-bold flex items-center gap-1 hover:underline transition-all hover:text-[1.05em] origin-right"
                >
                  {expandedFish === fish.id ? "إخفاء التفاصيل" : "عرض التفاصيل العلمية"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedFish === fish.id ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {expandedFish === fish.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-outline-variant/20 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-xs text-tertiary mb-1">الملوحة (Salinity)</span>
                            <span className="text-sm font-bold text-on-surface">{fish.salinity}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-tertiary mb-1">القلوية (pH)</span>
                            <span className="text-sm font-bold text-on-surface">{fish.ph}</span>
                          </div>
                        </div>
                        <div>
                          <span className="block text-xs text-tertiary mb-2">نصائح المربي:</span>
                          <ul className="space-y-1">
                            {fish.tips.map((tip, idx) => (
                              <li key={idx} className="text-xs text-on-surface-variant flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid: Interactive Lessons */}
      <section>
        <h3 className="text-3xl font-extrabold text-primary mb-12 font-headline">دروس تفاعلية</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Main Feature */}
          <div 
            onClick={() => setActiveTab("chat")}
            className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group bg-surface-container-high cursor-pointer"
          >
            <img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" alt="community" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDqmSvZ9vsfFdgCiBW9di5H_xk9wlfAY8yjhXXEFp9eeAogDqXLbsPgaoBDWHWmpavvYvE1VIFxqUx3jZX38zbh6icEAwuBbAndY8TJ4FZTIjq-oAiolMsTzSgi8c-MgYTn3-oXSnpoSIgneOtIUGHgWXP6MXq1INu9D2UZj-o2nPZVG8onTpwifUXn3OiBgbFqM5m2DbTCOIYH-6nV2SsEHh5p0SsNvteO6CEKjOfogHg_1ZamBFZNU6X1EhpAB89bMCBL_P3uKY" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h5 className="text-white text-3xl font-bold mb-4 font-headline">مجتمع المزارعين المبدعين</h5>
              <p className="text-white/80 mb-6">انضم إلى أكثر من 5000 مزارع يتبادلون الخبرات يومياً.</p>
              <div className="flex -space-x-4 space-x-reverse mb-6">
                <img className="w-10 h-10 rounded-full border-2 border-white" alt="user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtrX2uNRSV-xZQPg6qnp5g07wq8Xcdjdj8iKZVEt3Kg1qaPAszW8-E0chHicSt15SdAKinXtyu9WkTBxOmbluNqdzOpfWSzGOFpG6bL1_lZgvXE3_tWgYlGRVWJBpSoV1wRu7gldcCe98_nPL1yvyEHTTWKleWAoZDCi4CL4LmZkjKCMhzu6ww1ups5T_HWB3JmBNdEomHSq9tUbYCiS4DTvR_s8hVe6kdBvfKqxnuxDv1zf7_pX8fSMCLfgKUWLEaBla_3cwD40s" referrerPolicy="no-referrer" />
                <img className="w-10 h-10 rounded-full border-2 border-white" alt="user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUYZYxgk3pYnOzWDP33l8lbHxCFdIyp0SvyoxkCzGXKUiOtt-x-VQ0bQ8gT4ILClKWoCZ29gCFTVFoHiBa_B7vCl6GWyu4jqFwEcFCz-xdLwxGLahhed_GJpBlPORJbDPi4Ek30lZjpeLVWrWBDNMHpFhfn6DJ1PORiUlYd45ox1KdnsXzpCJAXDASUeQ6r737YZB5pj0nvdNvREjplPlE2-rARxEMTPOrHVpc60HoV7A2YYTYfeygT0CEKqLGJVpgBKWbqpIKm1I" referrerPolicy="no-referrer" />
                <img className="w-10 h-10 rounded-full border-2 border-white" alt="user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaIvjun5ciqDcMhTliWkowKmn_wcXQ_OsTV5Fs0_I_HtcJYBXamUvG2hrdkrL3MJhyolYX3IcOdfurY9FiTmdNnsm8U0tgHufnr6vvMNnUh14pNszoJJTHsGZOLaQvK5b-hL5P04gzbp2os9QhRPyG2AO2PwpF3BAmVE5KkAf9_9N32nsMx8A9HrKCkhnqEeckkeK9PTnNySJHzf-NY6hYZ5UraVqV_aNJAWuiiolQaq4POc_U1zTut9Ci9oYL5bl6Vk9rsslLy_k" referrerPolicy="no-referrer" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">+4k</div>
              </div>
            </div>
          </div>

          {/* Bento Item 1 */}
          <div 
            onClick={() => setActiveTab("monitor")}
            className="md:col-span-2 bg-secondary-container rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-secondary-fixed transition-colors"
          >
            <div>
              <Activity className="w-10 h-10 text-on-secondary-container mb-4" />
              <h5 className="text-2xl font-bold text-on-secondary-container font-headline">تحليل جودة المياه</h5>
              <p className="text-on-secondary-container/70 mt-2">تعلم كيفية قياس الـ pH والأكسجين الذائب بدقة.</p>
            </div>
            <div className="flex justify-end">
              <ArrowLeft className="w-6 h-6 text-on-secondary-container group-hover:-translate-x-2 transition-transform" />
            </div>
          </div>

          {/* Bento Item 2 */}
          <div 
            onClick={() => setActiveTab("calculator")}
            className="md:col-span-1 bg-tertiary-container rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-tertiary-fixed-dim transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <Fish className="w-10 h-10 text-white mb-4" />
              <h5 className="text-xl font-bold text-white font-headline">إدارة التغذية</h5>
            </div>
          </div>

          {/* Bento Item 3 */}
          <div 
            onClick={() => setActiveTab("updates")}
            className="md:col-span-1 bg-surface-container-highest rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-outline-variant transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <Waves className="w-10 h-10 text-primary mb-4" />
              <h5 className="text-xl font-bold text-primary font-headline">أحدث التطورات</h5>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 md:p-12 editorial-shadow">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-primary font-headline">أسئلة شائعة للبدء</h3>
            <p className="text-on-surface-variant mt-1">أهم ما يجب أن تعرفه قبل إطلاق مزرعتك الأولى.</p>
          </div>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <div 
              key={index}
              className={`border border-outline-variant/30 rounded-2xl overflow-hidden transition-colors ${expandedFaq === index ? 'bg-surface-container-low' : 'bg-transparent hover:bg-surface-container-lowest'}`}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
              >
                <span className="text-lg font-bold text-on-surface font-headline">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
