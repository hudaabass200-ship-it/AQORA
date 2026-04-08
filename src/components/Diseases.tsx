import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stethoscope, AlertTriangle, ShieldCheck, Fish, Search, ChevronLeft, Bot, Book, Send, Loader2, Syringe, Upload, Image as ImageIcon, Clock, Trash2, X } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

// Safe initialization to prevent app crash if env var is missing in Vercel
const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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
    name: "البلطي",
    diseases: [
      {
        id: "strep",
        name: "المكورات السبحية (Streptococcosis)",
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
        ]
      },
      {
        id: "aeromonas",
        name: "تسمم الدم الإيروموناسي (Aeromonas)",
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
        ]
      }
    ]
  },
  seabass: {
    name: "القاروص",
    diseases: [
      {
        id: "vnn",
        name: "النخر العصبي الفيروسي (VNN)",
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
        ]
      },
      {
        id: "vibriosis",
        name: "مرض الفيبريو (Vibriosis)",
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
        ]
      }
    ]
  },
  seabream: {
    name: "الدنيس",
    diseases: [
      {
        id: "pasteurellosis",
        name: "الباستيريلا (Pasteurellosis)",
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
        ]
      },
      {
        id: "parasites",
        name: "الطفيليات الخارجية (Parasitic Infections)",
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
        ]
      }
    ]
  }
};

export default function Diseases() {
  const [viewMode, setViewMode] = useState<"guide" | "ai" | "history">("guide");
  
  // Guide State
  const [selectedFish, setSelectedFish] = useState<keyof typeof DISEASES_DATA>("tilapia");
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  // AI Diagnosis State
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

  const currentData = DISEASES_DATA[selectedFish];

  const handleDiagnose = async () => {
    if (!symptoms.trim() && !imageFile) return;
    
    setIsDiagnosing(true);
    setDiagnosisError("");
    setDiagnosisResult("");

    if (!ai) {
      setDiagnosisError("⚠️ مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) غير متوفر. يرجى إضافته في إعدادات Vercel (Environment Variables) ثم إعادة بناء المشروع (Redeploy).");
      setIsDiagnosing(false);
      return;
    }

    try {
      const promptText = `أنا مربي أسماك وعندي مشكلة في الحوض. 
نوع السمك: ${DISEASES_DATA[diagnosisFish].name}. 
${symptoms ? `الأعراض التي ألاحظها: ${symptoms}.` : 'يوجد صورة مرفقة للحالة.'}

بناءً على هذه الأعراض والصورة (إن وجدت)، أجب على التالي بدقة علمية:
1. ما هو المرض أو الأمراض المتوقعة؟
2. كيف أتأكد من التشخيص بشكل قاطع؟
3. ما هي خطوات العلاج الفورية والوقاية؟

نسق الإجابة في نقاط واضحة ومختصرة باللغة العربية.`;

      const parts: any[] = [{ text: promptText }];
      
      if (imageFile && imagePreview) {
        const base64Data = imagePreview.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts }],
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

    } catch (err) {
      console.error("Diagnosis error:", err);
      setDiagnosisError("حدث خطأ أثناء التشخيص. تأكد من اتصالك بالإنترنت أو صلاحية مفتاح API.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-red-500" />
          دليل الأمراض والتشخيص
        </h2>
        <p className="text-slate-600">
          تصفح الأمراض الشائعة أو استخدم التشخيص الذكي لمعرفة المرض بناءً على الأعراض التي تلاحظها في الحوض.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex p-1 bg-slate-200/60 rounded-xl max-w-lg mb-8 overflow-x-auto">
        <button
          onClick={() => setViewMode("guide")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
            viewMode === "guide" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Book className="w-4 h-4" />
          الدليل الثابت
        </button>
        <button
          onClick={() => setViewMode("ai")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
            viewMode === "ai" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Bot className="w-4 h-4" />
          التشخيص الذكي
        </button>
        <button
          onClick={() => setViewMode("history")}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
            viewMode === "history" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          سجل التشخيصات
        </button>
      </div>

      {viewMode === "guide" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Fish Selector */}
          <div className="flex flex-wrap gap-4 mb-8">
            {(Object.keys(DISEASES_DATA) as Array<keyof typeof DISEASES_DATA>).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedFish(key);
                  setSelectedDisease(null);
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${
                  selectedFish === key
                    ? "bg-slate-800 text-white shadow-lg scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Fish className={`w-5 h-5 ml-2 ${selectedFish === key ? "text-blue-400" : "text-slate-400"}`} />
                {DISEASES_DATA[key].name}
              </button>
            ))}
          </div>

          {/* Diseases List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Search className="w-5 h-5 ml-2 text-slate-400" />
                اختر المرض للتشخيص
              </h3>
              {currentData.diseases.map((disease) => (
                <button
                  key={disease.id}
                  onClick={() => setSelectedDisease(disease.id)}
                  className={`w-full text-right p-4 rounded-xl border transition-all ${
                    selectedDisease === disease.id
                      ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-red-200 hover:bg-red-50/50"
                  }`}
                >
                  <span className="font-bold block">{disease.name}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedDisease ? (
                  <motion.div
                    key={selectedDisease}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                  >
                    {currentData.diseases
                      .filter((d) => d.id === selectedDisease)
                      .map((disease) => (
                        <div key={disease.id}>
                          <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">{disease.name}</h3>
                            <button 
                              onClick={() => setSelectedDisease(null)}
                              className="text-slate-400 hover:text-white lg:hidden"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                          </div>
                          
                          <div className="p-6 md:p-8 space-y-6">
                            {/* Symptoms */}
                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 shadow-sm">
                              <h4 className="font-bold text-orange-900 mb-4 flex items-center text-lg">
                                <AlertTriangle className="w-6 h-6 ml-2 text-orange-500" />
                                الأعراض (للتشخيص المبكر)
                              </h4>
                              <ul className="space-y-3 text-orange-800">
                                {disease.symptoms.map((symptom, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 ml-3 flex-shrink-0"></span>
                                    <span className="leading-relaxed">{symptom}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Treatment */}
                            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                                <Syringe className="w-6 h-6 ml-2 text-emerald-500" />
                                خطوات العلاج
                              </h4>
                              <ul className="space-y-3 text-emerald-800">
                                {disease.treatment.map((step, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 ml-3 flex-shrink-0"></span>
                                    <span className="leading-relaxed">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Prevention */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                              <h4 className="font-bold text-blue-900 mb-4 flex items-center text-lg">
                                <ShieldCheck className="w-6 h-6 ml-2 text-blue-500" />
                                الإجراءات الوقائية
                              </h4>
                              <ul className="space-y-3 text-blue-800">
                                {disease.prevention.map((step, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 ml-3 flex-shrink-0"></span>
                                    <span className="leading-relaxed">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[300px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center"
                  >
                    <Stethoscope className="w-16 h-16 mb-4 text-slate-300" />
                    <p className="text-lg font-medium text-slate-500">اختر مرضاً من القائمة الجانبية لعرض تفاصيل التشخيص والعلاج.</p>
                    <p className="text-sm mt-2">التشخيص المبكر هو مفتاح إنقاذ الحوض من انتشار العدوى.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ) : viewMode === "ai" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">طبيب الأسماك الذكي</h3>
              <p className="text-slate-600 mt-1">
                صف الأعراض التي تلاحظها على الأسماك أو في الحوض (مثل: بقع حمراء، سباحة غير طبيعية، قلة الأكل)، وسيقوم الذكاء الاصطناعي بتشخيص الحالة وإعطائك خطوات العلاج.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نوع السمك المصاب</label>
              <div className="relative">
                <Fish className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={diagnosisFish}
                  onChange={(e) => setDiagnosisFish(e.target.value as keyof typeof DISEASES_DATA)}
                  className="w-full md:w-1/2 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="tilapia">البلطي</option>
                  <option value="seabass">القاروص</option>
                  <option value="seabream">الدنيس</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">وصف الأعراض بدقة</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="مثال: الأسماك تتجمع عند سطح الماء، ترفض الأكل، وهناك بقع حمراء على الزعانف..."
                className="w-full h-32 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">إرفاق صورة للحالة (اختياري)</label>
              {imagePreview ? (
                <div className="relative w-full md:w-1/2 h-48 rounded-xl overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={clearImage} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full md:w-1/2 h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">اضغط لرفع صورة</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            <button
              onClick={handleDiagnose}
              disabled={isDiagnosing || (!symptoms.trim() && !imageFile)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{diagnosisError}</p>
              </div>
            )}

            {diagnosisResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200"
              >
                <h4 className="font-bold text-slate-800 mb-6 flex items-center text-lg border-b border-slate-200 pb-4">
                  <Stethoscope className="w-6 h-6 ml-2 text-blue-600" />
                  نتيجة التشخيص والتوصيات
                </h4>
                <div className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-blue-600 prose-li:marker:text-blue-500" dir="rtl">
                  <ReactMarkdown>{diagnosisResult}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : viewMode === "history" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {history.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
              <Clock className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">لا يوجد سجل تشخيصات</h3>
              <p className="text-slate-500">قم باستخدام "التشخيص الذكي" وسيتم حفظ نتائج التشخيص هنا للرجوع إليها لاحقاً.</p>
              <button 
                onClick={() => setViewMode("ai")}
                className="mt-6 bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                ابدأ تشخيص جديد
              </button>
            </div>
          ) : (
            history.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <Fish className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{record.fishType}</h4>
                      <span className="text-xs text-slate-500">
                        {new Date(record.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteHistoryRecord(record.id)}
                    className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                    title="حذف السجل"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {record.imagePreview && (
                      <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200">
                        <img src={record.imagePreview} alt="صورة الحالة" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {record.symptoms && (
                      <div className="flex-1">
                        <h5 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          الأعراض المسجلة:
                        </h5>
                        <p className="text-slate-600 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">{record.symptoms}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-6">
                    <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                      نتيجة التشخيص:
                    </h5>
                    <div className="prose prose-slate prose-blue max-w-none prose-sm prose-headings:font-bold prose-a:text-blue-600" dir="rtl">
                      <ReactMarkdown>{record.result}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      ) : null}
    </div>
  );
}
