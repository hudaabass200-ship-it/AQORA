import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Fish, Waves, ThermometerSun, Info, ChevronLeft, Camera } from "lucide-react";

const FISH_DATA = [
  {
    id: "tilapia",
    name: "البلطي (Tilapia)",
    image: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=800&q=80",
    description: "السمكة الأكثر شعبية في مصر. تتحمل الظروف القاسية وتنمو بسرعة. مثالية للمربين المبتدئين.",
    waterType: "مياه عذبة",
    temp: "25 - 30 درجة مئوية",
    salinity: "0 - 5 جزء في الألف",
    ph: "6.5 - 9.0",
    tips: [
      "تأكد من جودة الأعلاف ونسبة البروتين (لا تقل عن 25-30%).",
      "تغيير المياه بانتظام للحفاظ على نسبة الأكسجين.",
      "مراقبة الأمونيا باستمرار، خاصة في فصل الصيف."
    ]
  },
  {
    id: "seabass",
    name: "القاروص (Sea Bass)",
    image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80",
    description: "سمكة بحرية ذات قيمة اقتصادية عالية. تحتاج إلى رعاية أكبر وجودة مياه ممتازة.",
    waterType: "مياه مالحة / شروب",
    temp: "22 - 28 درجة مئوية",
    salinity: "15 - 35 جزء في الألف",
    ph: "7.5 - 8.5",
    tips: [
      "تحتاج إلى نسبة أكسجين مذاب عالية (أكثر من 5 مجم/لتر).",
      "الأعلاف يجب أن تحتوي على نسبة بروتين عالية (40-45%).",
      "حساسة للتغيرات المفاجئة في درجات الحرارة."
    ]
  },
  {
    id: "seabream",
    name: "الدنيس (Sea Bream)",
    image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=800&q=80",
    description: "من أجود أنواع الأسماك البحرية في السوق المصري. تتطلب خبرة في التغذية وإدارة الأحواض.",
    waterType: "مياه مالحة",
    temp: "18 - 26 درجة مئوية",
    salinity: "30 - 40 جزء في الألف",
    ph: "7.5 - 8.5",
    tips: [
      "تجنب الازدحام في الأحواض لتقليل الإجهاد والأمراض.",
      "تحتاج إلى إضاءة جيدة ونظام فلترة قوي.",
      "مراقبة الطفيليات الخارجية بانتظام."
    ]
  }
];

export default function Education() {
  const [selectedFish, setSelectedFish] = useState<string | null>(null);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('customFishImages');
    if (stored) {
      try {
        setCustomImages(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const handleImageUpload = (fishId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImages = { ...customImages, [fishId]: base64String };
        setCustomImages(newImages);
        localStorage.setItem('customFishImages', JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const getImage = (fish: any) => customImages[fish.id] || fish.image;

  if (selectedFish) {
    const fish = FISH_DATA.find((f) => f.id === selectedFish)!;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <button
          onClick={() => setSelectedFish(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 ml-1" />
          العودة للقائمة
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-64 overflow-hidden relative group/img bg-slate-50">
            <img src={getImage(fish)} alt={fish.name} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
            <label className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 rounded-xl cursor-pointer transition-colors z-10 text-white flex items-center gap-2" title="تغيير الصورة">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(fish.id, e)} />
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium pr-1">تغيير الصورة</span>
            </label>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 pointer-events-none">
              <h2 className="text-3xl font-bold text-white drop-shadow-md">{fish.name}</h2>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <p className="text-lg text-slate-600 leading-relaxed">{fish.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                  <Waves className="w-5 h-5 ml-2 text-blue-600" />
                  بيئة التربية المثالية
                </h3>
                <ul className="space-y-3 text-blue-800">
                  <li><span className="font-semibold">نوع المياه:</span> {fish.waterType}</li>
                  <li><span className="font-semibold">درجة الحرارة:</span> {fish.temp}</li>
                  <li><span className="font-semibold">الملوحة:</span> {fish.salinity}</li>
                  <li><span className="font-semibold">الأس الهيدروجيني (pH):</span> {fish.ph}</li>
                </ul>
              </div>

              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 ml-2 text-emerald-600" />
                  نصائح هامة للمربي
                </h3>
                <ul className="space-y-3 text-emerald-800 list-disc list-inside">
                  {fish.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">أكاديمية الاستزراع السمكي</h2>
        <p className="text-slate-600">اختر نوع السمك لتتعلم أساسيات التربية والرعاية من الصفر.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FISH_DATA.map((fish, idx) => (
          <motion.div
            key={fish.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedFish(fish.id)}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group"
          >
            <div className="h-48 overflow-hidden relative group/img bg-slate-50">
              <img 
                src={getImage(fish)} 
                alt={fish.name} 
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <label 
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(fish.id, e)} />
                <div className="text-white flex flex-col items-center">
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">تغيير الصورة</span>
                </div>
              </label>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
                <Fish className="w-5 h-5 ml-2 text-blue-500" />
                {fish.name}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-2">{fish.description}</p>
              <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                اقرأ الدليل الكامل
                <ChevronLeft className="w-4 h-4 mr-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
