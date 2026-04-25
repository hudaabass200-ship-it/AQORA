import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stethoscope, AlertTriangle, ShieldCheck, Fish, Search, ChevronLeft, Bot, Book, Send, Loader2, Syringe, Upload, Image as ImageIcon, Clock, Trash2, X, Filter, Microscope, Bug, Droplet } from "lucide-react";
import { tryAIRequest } from "../lib/ai";
import ReactMarkdown from "react-markdown";

interface DiagnosisRecord {
  id: string;
  date: string;
  fishType: string;
  symptoms: string;
  imagePreview?: string;
  result: string;
}

const DISEASES_DATA = {
  tilapia: {
    name: "بلطي (Tilapia)",
    diseases: [
      {
        id: "strep",
        name: "مرض المكورات السبحية",
        type: "Bacterial",
        severity: "شائع جداً",
        icon: Droplet,
        colorClass: "text-tertiary bg-tertiary-container/10",
        symptoms: [
          "جحوظ العينين (خروج العين عن مسارها أو عتامة العين).",
          "نزيف حول الفم وقاعدة الزعانف.",
          "سباحة غير طبيعية أو دوران السمكة في دوائر.",
          "فقدان الشهية والنفوق السريع خاصة في الصيف."
        ],
        treatment: [
          "وقف التغذية فوراً أو تقليلها بشكل كبير لتقليل الإجهاد.",
          "استخدام مضاد حيوي (مثل الفلورفينيكول أو الإريثرومايسين) مضافاً للعلف تحت إشراف بيطري."
        ],
        prevention: [
          "تحسين جودة المياه وزيادة نسبة الأكسجين المذاب.",
          "إزالة الأسماك النافقة فوراً وبشكل يومي لمنع انتشار العدوى.",
          "تجنب التغذية الزائدة في فترات ارتفاع درجات الحرارة."
        ],
        shortDesc: "تعد عدوى (Streptococcosis) واحدة من أخطر المشاكل الصحية التي تواجه مزارع البلطي عالمياً، وتسبب خسائر اقتصادية كبيرة في فترات الصيف."
      },
      {
        id: "aeromonas",
        name: "الإصابة بالأيروموناس",
        type: "Aeromonas",
        severity: "علاج متوفر",
        icon: Droplet,
        colorClass: "text-tertiary bg-tertiary-container/10",
        symptoms: [
          "تقرحات حمراء أو نزيف على الجلد.",
          "تآكل في الزعانف والذيل.",
          "انتفاخ البطن وتراكم السوائل (الاستسقاء).",
          "بروز قشور السمكة للخارج."
        ],
        treatment: [
          "استخدام مضاد حيوي مناسب (مثل الأوكسي تتراسيكلين) بعد عمل اختبار حساسية.",
          "تطهير الجروح السطحية إن أمكن للأسماك القيمة."
        ],
        prevention: [
          "تغيير 20-30% من مياه الحوض لتحسين الجودة وتقليل الحمل البكتيري.",
          "إضافة فيتامين سي (Vitamin C) للعلف لرفع مناعة الأسماك.",
          "تجنب التداول العنيف للأسماك لمنع الجروح التي تسهل دخول البكتيريا."
        ],
        shortDesc: "تسبب نزيفاً على الجلد والزعانف، وغالباً ما ترتبط بسوء جودة المياه في الأحواض المكثفة."
      },
      {
        id: "columnaris",
        name: "مرض كولومينارس",
        type: "Columnaris",
        severity: "عالي الخطورة",
        icon: Bug,
        colorClass: "text-error bg-error-container/10",
        symptoms: [
          "بقع بيضاء على الرأس والزعانف.",
          "تآكل الخياشيم.",
          "نفوق سريع."
        ],
        treatment: [
          "استخدام مضادات حيوية في الماء.",
          "تحسين جودة المياه."
        ],
        prevention: [
          "تقليل الكثافة.",
          "تجنب الإجهاد."
        ],
        shortDesc: "يظهر كتقرحات بيضاء أو رمادية على الرأس والزعانف، سريع الانتشار في درجات الحرارة العالية."
      }
    ]
  },
  seabass: {
    name: "قاروص (Bass)",
    diseases: [
      {
        id: "vnn",
        name: "النخر العصبي الفيروسي (VNN)",
        type: "Viral",
        severity: "عالي الخطورة",
        icon: Bug,
        colorClass: "text-error bg-error-container/10",
        symptoms: [
          "سباحة غير طبيعية (دوران حلزوني أو فقدان التوازن).",
          "اسوداد لون السمكة بشكل ملحوظ.",
          "انتفاخ المثانة الهوائية والطفو على السطح.",
          "يصيب غالباً الزريعة والأسماك الصغيرة ويسبب نسب نفوق عالية جداً."
        ],
        treatment: [
          "تنبيه هام: لا يوجد علاج مباشر للأمراض الفيروسية.",
          "عزل الأحواض المصابة فوراً لمنع انتقال العدوى للأحواض السليمة."
        ],
        prevention: [
          "الوقاية هي الحل الوحيد: شراء زريعة معتمدة وخالية من الفيروس (SPF).",
          "تطهير الأحواض والأدوات جيداً قبل بدء الدورة.",
          "رفع المناعة باستخدام البروبيوتيك ومنشطات المناعة في العلف."
        ],
        shortDesc: "مرض فيروسي خطير يصيب الجهاز العصبي للأسماك، خاصة الزريعة، ويسبب نسب نفوق عالية."
      },
      {
        id: "vibriosis",
        name: "مرض الفيبريو (Vibriosis)",
        type: "Bacterial",
        severity: "شائع",
        icon: Droplet,
        colorClass: "text-tertiary bg-tertiary-container/10",
        symptoms: [
          "بقع حمراء ونزيف على الجلد والزعانف.",
          "فقدان الشهية وخمول شديد.",
          "تضخم في الطحال والكبد (يُلاحظ عند التشريح).",
          "تقرحات عميقة في العضلات في الحالات المتأخرة."
        ],
        treatment: [
          "استخدام مضادات حيوية (مثل الأوكسي تتراسيكلين أو الفلوروكينولونات) في العلف.",
          "تقليل كثافة الأسماك في الحوض لتقليل الإجهاد مؤقتاً."
        ],
        prevention: [
          "تحسين التهوية وجودة المياه بشكل عاجل وتقليل نسبة المواد العضوية.",
          "تجنب التغيرات المفاجئة في درجات الحرارة والملوحة.",
          "استخدام اللقاحات المتاحة للفيبريو في المناطق الموبوءة."
        ],
        shortDesc: "عدوى بكتيرية شائعة في المياه المالحة تسبب نزيفاً وتقرحات، وتنشط مع سوء جودة المياه."
      }
    ]
  },
  seabream: {
    name: "دنيس (Bream)",
    diseases: [
      {
        id: "pasteurellosis",
        name: "الباستيريلا (Pasteurellosis)",
        type: "Bacterial",
        severity: "عالي الخطورة",
        icon: Bug,
        colorClass: "text-error bg-error-container/10",
        symptoms: [
          "خمول مفاجئ وفقدان للشهية.",
          "بقع بيضاء صغيرة (عقد) على الخياشيم والطحال والكلى.",
          "نفوق مفاجئ وسريع خاصة عند انخفاض درجة الحرارة ثم ارتفاعها.",
          "اسوداد لون الجسم."
        ],
        treatment: [
          "استخدام المضادات الحيوية المناسبة في العلف فور ظهور الأعراض الأولى."
        ],
        prevention: [
          "التطعيم المسبق (اللقاحات) هو أفضل وسيلة للوقاية من هذا المرض في الدنيس.",
          "تقليل الإجهاد الناتج عن النقل أو سوء جودة المياه.",
          "المراقبة الدقيقة للأسماك خلال فترات تقلب درجات الحرارة."
        ],
        shortDesc: "مرض بكتيري حاد يسبب نفوقاً سريعاً، يتميز بظهور عقد بيضاء على الأعضاء الداخلية."
      },
      {
        id: "parasites",
        name: "قمل السمك (أرجولس)",
        type: "Parasites",
        severity: "طفيلي",
        icon: Bug,
        colorClass: "text-primary bg-primary-container/10",
        symptoms: [
          "حكة الأسماك واحتكاكها المستمر بجدران الحوض أو المواسير.",
          "ظهور قرح جلدية أو زيادة في إفراز المخاط على الخياشيم.",
          "صعوبة في التنفس وتجمع الأسماك عند مصادر الأكسجين.",
          "رؤية الطفيليات (مثل الأيزوبودا أو الكوبيبودا) بالعين المجردة على الخياشيم أو الجلد."
        ],
        treatment: [
          "عمل حمامات علاجية باستخدام الفورمالين أو بيروكسيد الهيدروجين بجرعات دقيقة جداً (تحت إشراف متخصص).",
          "إزالة الأسماك المصابة بشدة وعزلها."
        ],
        prevention: [
          "الحفاظ على نظافة قاع الحوض وتقليل تراكم الفضلات.",
          "فحص الزريعة جيداً قبل إنزالها في الأحواض.",
          "تجنب إدخال مياه غير مفلترة تحتوي على أطوار معدية للطفيليات."
        ],
        shortDesc: "طفيليات خارجية تلتصق بجسم السمكة وتتسبب في تهيج شديد وضعف عام في النمو."
      }
    ]
  }
};

export default function Diseases() {
  const [viewMode, setViewMode] = useState<"guide" | "history">("guide");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedDisease, setSelectedDisease] = useState<any | null>(null);

  // AI Diagnosis State
  const [showAiModal, setShowAiModal] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [diagnosisFish, setDiagnosisFish] = useState<keyof typeof DISEASES_DATA>("tilapia");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState("");

  // History State
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("farm_diagnosis_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const deleteHistoryRecord = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem("farm_diagnosis_history", JSON.stringify(updated));
  };

  const handleDiagnose = async () => {
    if (!symptoms.trim() && !imageFile) return;
    
    setIsDiagnosing(true);
    setDiagnosisError("");
    setDiagnosisResult("");

    try {
      const promptText = `أنا مربي أسماك وعندي مشكلة في الحوض. 
نوع السمك: ${DISEASES_DATA[diagnosisFish].name}. 
${symptoms ? `الأعراض التي ألاحظها: ${symptoms}.` : 'يوجد صورة مرفقة للحالة.'}

بناءً على هذه الأعراض والصورة (إن وجدت)، أجب على التالي بدقة علمية:
1. ما هو المرض أو الأمراض المتوقعة؟
2. كيف أتأكد من التشخيص بشكل قاطع؟
3. ما هي خطوات العلاج الفورية والوقاية؟

نسق الإجابة في نقاط واضحة ومختصرة باللغة العربية.`;

      const imageParts = (imageFile && imagePreview) ? [{
        inlineData: {
          data: imagePreview.split(',')[1],
          mimeType: imageFile.type
        }
      }] : [];

      const response = await tryAIRequest({
        model: "gemini-3-flash-preview",
        contents: { 
          parts: [{ text: promptText }, ...imageParts] 
        },
      });
      
      const resultText = response.text || "";
      setDiagnosisResult(resultText);

      const newRecord: DiagnosisRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        fishType: DISEASES_DATA[diagnosisFish].name,
        symptoms,
        imagePreview: imagePreview || undefined,
        result: resultText
      };
      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("farm_diagnosis_history", JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error("Diagnosis error:", err);
      const errorMsg = err.message || "";
      let friendlyError = "حدث خطأ أثناء التشخيص. تأكد من اتصالك بالإنترنت أو صلاحية مفتاح API.";
      
      if (errorMsg.includes("404") || errorMsg.includes("NOT_FOUND")) {
        friendlyError = "خطأ 404: المحرك غير موجود. تأكد من عمل 'Redeploy' في Vercel بعد إضافة المفاتيح.";
      } else if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("credits are depleted")) {
        friendlyError = "⚠️ عذراً، انتهى الرصيد في جميع المفاتيح المتاحة (3 مفاتيح). يرجى إضافة مفتاح جديد لـ GEMINI_API_KEY3 أو شحن الرصيد ثم عمل 'Redeploy'.";
      } else if (errorMsg.includes("No API keys")) {
        friendlyError = "⚠️ لم يتم العثور على أي مفاتيح API. يرجى إضافتها في Vercel لكي يتمكن المستشار من تشخيص الحالة.";
      }
      
      setDiagnosisError(friendlyError);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const allDiseases = Object.entries(DISEASES_DATA).flatMap(([fishKey, fishData]) => 
    fishData.diseases.map(d => ({ ...d, fishKey }))
  );

  const filteredDiseases = selectedFilter === "all" 
    ? allDiseases 
    : allDiseases.filter(d => d.fishKey === selectedFilter);

  const mainDisease = filteredDiseases[0];
  const otherDiseases = filteredDiseases.slice(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header */}
      <section className="mb-10">
        <h2 className="text-4xl font-black text-on-surface mb-2 font-headline leading-[1.2]">
          دليل الأمراض<br/><span className="text-primary">والتشخيص الذكي</span>
        </h2>
        <p className="text-on-surface-variant max-w-md leading-relaxed text-lg">
          استكشف الموسوعة الشاملة لأمراض الاستزراع السمكي أو قم بمراجعة سجلات التشخيص الخاصة بمزارعك.
        </p>
      </section>

      {/* Tabbed Interface */}
      <div className="bg-surface-container-low p-1.5 rounded-full flex mb-8 w-full md:w-fit">
        <button 
          onClick={() => setViewMode("guide")}
          className={`flex-1 md:px-8 py-3 rounded-full font-bold transition-all duration-300 ${viewMode === "guide" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant font-medium hover:bg-surface-container-high"}`}
        >
          الدليل الدائم
        </button>
        <button 
          onClick={() => setViewMode("history")}
          className={`flex-1 md:px-8 py-3 rounded-full font-bold transition-all duration-300 ${viewMode === "history" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant font-medium hover:bg-surface-container-high"}`}
        >
          سجل التشخيص
        </button>
      </div>

      {viewMode === "guide" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {selectedDisease ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedDisease(null)}
                className="flex items-center text-primary hover:text-primary-container font-bold transition-colors mb-4"
              >
                <ChevronLeft className="w-5 h-5 ml-1" />
                العودة للدليل
              </button>
              <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/20">
                <div className="p-8 md:p-12 space-y-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-error-container text-on-error-container text-xs font-bold rounded-full">{selectedDisease.severity}</span>
                    <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-bold rounded-full italic">{selectedDisease.type}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3 font-headline">{selectedDisease.name}</h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                    {selectedDisease.shortDesc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Symptoms */}
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
                      <h4 className="font-bold text-orange-900 mb-4 flex items-center text-lg">
                        <AlertTriangle className="w-6 h-6 ml-2 text-orange-500" />
                        الأعراض
                      </h4>
                      <ul className="space-y-3 text-orange-800">
                        {selectedDisease.symptoms.map((symptom: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 ml-3 flex-shrink-0"></span>
                            <span className="leading-relaxed text-sm">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Treatment */}
                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
                      <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                        <Syringe className="w-6 h-6 ml-2 text-emerald-500" />
                        العلاج
                      </h4>
                      <ul className="space-y-3 text-emerald-800">
                        {selectedDisease.treatment.map((step: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 ml-3 flex-shrink-0"></span>
                            <span className="leading-relaxed text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                      <h4 className="font-bold text-blue-900 mb-4 flex items-center text-lg">
                        <ShieldCheck className="w-6 h-6 ml-2 text-blue-500" />
                        الوقاية
                      </h4>
                      <ul className="space-y-3 text-blue-800">
                        {selectedDisease.prevention.map((step: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 ml-3 flex-shrink-0"></span>
                            <span className="leading-relaxed text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Filters Grid */}
              <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setSelectedFilter("all")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-none whitespace-nowrap transition-colors ${selectedFilter === "all" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"}`}
                >
                  <Filter className="w-4 h-4" />
                  الكل
                </button>
                {Object.entries(DISEASES_DATA).map(([key, data]) => (
                  <button 
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-colors ${selectedFilter === key ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"}`}
                  >
                    {data.name}
                  </button>
                ))}
              </div>

              {/* Bento Grid Disease List */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Highlighted Disease Card (Asymmetric) */}
                {mainDisease && (
                  <div className="md:col-span-8 group relative overflow-hidden bg-surface-container-lowest rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/20 transition-transform hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 w-2 h-full bg-secondary rounded-full"></div>
                    <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCynNDPW4HK0qmQfc7LfL9X_xyW-0zDXZoFUQOvhDXGEvevJeiDwYaNor_cxt3IyS3hI2MVm-bsnqGFfrtUicg6B1ykTJUnRraz4M5g-S7F2IpwbqsFgOJYIZHlbTqjXeiD26k7tJKIddslNMANlVyQHpD4wZlqyBwn6V9cVEw4If-zEuuLceooP4eSf7341I2e7Jk21eg3pXczsy5HFnldArZLjLPDIDYICevaHueh-Ke1k0xBB9E8bkxp9GgwItfM8xJs7nwwMFk" 
                          alt="Fish under microscope" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 bg-error-container text-on-error-container text-xs font-bold rounded-full">{mainDisease.severity}</span>
                          <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-bold rounded-full italic">{mainDisease.type}</span>
                        </div>
                        <h3 className="text-2xl font-black mb-3 font-headline">{mainDisease.name}</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                          {mainDisease.shortDesc}
                        </p>
                        <button 
                          onClick={() => setSelectedDisease(mainDisease)}
                          className="flex items-center gap-2 text-primary font-bold group-hover:translate-x-[-4px] transition-transform"
                        >
                          اقرأ المزيد 
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Side Card: Quick Action */}
                <div className="md:col-span-4 bg-primary text-white rounded-[2rem] p-8 flex flex-col justify-between shadow-lg shadow-primary/20 relative overflow-hidden">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <Microscope className="w-10 h-10 mb-6" />
                    <h3 className="text-xl font-bold mb-2">تشخيص ذكي؟</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">استخدم الكاميرا لتحليل حالة الأسماك فوراً وتلقي التوصيات العلاجية.</p>
                  </div>
                  <button 
                    onClick={() => setShowAiModal(true)}
                    className="mt-8 bg-white text-primary px-6 py-4 rounded-2xl font-bold text-center active:scale-95 transition-transform relative z-10"
                  >
                    ابدأ الفحص الآن
                  </button>
                </div>

                {/* List Cards */}
                {otherDiseases.map((disease, idx) => {
                  const Icon = disease.icon;
                  return (
                    <div key={disease.id} className="md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow border border-outline-variant/20 cursor-pointer" onClick={() => setSelectedDisease(disease)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${disease.colorClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-outline">{disease.type}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{disease.name}</h4>
                      <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3">{disease.shortDesc}</p>
                      <div className="mt-6 pt-6 border-t border-surface-container-high flex justify-between items-center">
                        <span className={`text-xs font-semibold ${disease.severity === 'عالي الخطورة' ? 'text-error' : disease.severity === 'طفيلي' ? 'text-primary' : 'text-secondary'}`}>{disease.severity}</span>
                        <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Educational Callout */}
              <section className="mt-12 p-8 bg-surface-container-low rounded-[2rem] border-r-4 border-tertiary">
                <h5 className="text-tertiary font-bold mb-2 text-lg">نصيحة "المُوجّه السائل"</h5>
                <p className="text-on-surface-variant leading-relaxed italic">"الوقاية تبدأ دائمًا بمراقبة الأكسجين المذاب. ٩٠٪ من حالات تفشي البكتيريا تبدأ بضغط بيئي ناتج عن انخفاض مستويات الأكسجين ليلاً."</p>
              </section>
            </>
          )}
        </motion.div>
      ) : viewMode === "history" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {history.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/20 p-12 text-center flex flex-col items-center justify-center">
              <Clock className="w-16 h-16 text-outline mb-4" />
              <h3 className="text-xl font-bold text-on-surface mb-2">لا يوجد سجل تشخيصات</h3>
              <p className="text-on-surface-variant">قم باستخدام "التشخيص الذكي" وسيتم حفظ نتائج التشخيص هنا للرجوع إليها لاحقاً.</p>
              <button 
                onClick={() => setShowAiModal(true)}
                className="mt-6 bg-primary-container/10 text-primary hover:bg-primary-container/20 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                ابدأ تشخيص جديد
              </button>
            </div>
          ) : (
            history.map((record) => (
              <div key={record.id} className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/20 overflow-hidden">
                <div className="bg-surface-container-low p-6 border-b border-outline-variant/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-container/10 text-primary rounded-full flex items-center justify-center">
                      <Fish className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-lg">{record.fishType}</h4>
                      <span className="text-sm text-on-surface-variant">
                        {new Date(record.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteHistoryRecord(record.id)}
                    className="text-outline hover:text-error p-2 transition-colors"
                    title="حذف السجل"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {record.imagePreview && (
                      <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-outline-variant/20">
                        <img src={record.imagePreview} alt="صورة الحالة" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {record.symptoms && (
                      <div className="flex-1">
                        <h5 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          الأعراض المسجلة:
                        </h5>
                        <p className="text-on-surface-variant bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">{record.symptoms}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-outline-variant/20 pt-6">
                    <h5 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      نتيجة التشخيص:
                    </h5>
                    <div className="prose prose-slate max-w-none prose-sm prose-headings:font-bold prose-a:text-primary" dir="rtl">
                      <ReactMarkdown>{record.result}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      ) : null}

      {/* AI Diagnosis Modal */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface-container-lowest/90 backdrop-blur-md p-6 border-b border-outline-variant/20 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-container/10 text-primary rounded-full flex items-center justify-center">
                    <Microscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-on-surface">التشخيص الذكي</h3>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-outline hover:text-on-surface transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">نوع السمك المصاب</label>
                  <div className="relative">
                    <Fish className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <select
                      value={diagnosisFish}
                      onChange={(e) => setDiagnosisFish(e.target.value as keyof typeof DISEASES_DATA)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary appearance-none font-medium"
                    >
                      <option value="tilapia">البلطي</option>
                      <option value="seabass">القاروص</option>
                      <option value="seabream">الدنيس</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">وصف الأعراض بدقة</label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="مثال: الأسماك تتجمع عند سطح الماء، ترفض الأكل، وهناك بقع حمراء على الزعانف..."
                    className="w-full h-32 bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-medium"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">إرفاق صورة للحالة (اختياري)</label>
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-outline-variant/30">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={clearImage} className="absolute top-2 right-2 bg-error text-on-error p-2 rounded-full hover:bg-error/90 transition-colors shadow-md">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant/50 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 text-outline mb-2" />
                        <p className="text-sm text-on-surface-variant font-medium">اضغط لرفع صورة</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <button
                  onClick={handleDiagnose}
                  disabled={isDiagnosing || (!symptoms.trim() && !imageFile)}
                  className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDiagnosing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري تحليل الأعراض...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      تشخيص الحالة
                    </>
                  )}
                </button>

                {diagnosisError && (
                  <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-start gap-3 border border-error-container/50">
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="font-medium">{diagnosisError}</p>
                  </div>
                )}

                {diagnosisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-surface-container-low rounded-2xl p-6 md:p-8 border border-outline-variant/30"
                  >
                    <h4 className="font-bold text-on-surface mb-6 flex items-center text-lg border-b border-outline-variant/20 pb-4">
                      <Stethoscope className="w-6 h-6 ml-2 text-primary" />
                      نتيجة التشخيص والتوصيات
                    </h4>
                    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-on-surface prose-a:text-primary prose-li:marker:text-primary" dir="rtl">
                      <ReactMarkdown>{diagnosisResult}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
