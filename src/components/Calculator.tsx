import { useState } from "react";
import { motion } from "motion/react";
import { Calculator as CalcIcon, Scale, Fish, Info, Thermometer, TrendingUp, CheckCircle, Waves, Lightbulb } from "lucide-react";

export default function Calculator() {
  const [fishType, setFishType] = useState("tilapia");
  const [fishCount, setFishCount] = useState<number | "">("");
  const [avgWeight, setAvgWeight] = useState<number | "">("");
  const [waterTemp, setWaterTemp] = useState<number | "">("");

  // Simplified feed rates based on fish type (percentage of body weight)
  const feedRates = {
    seabass: 0.015, // 1.5%
    seabream: 0.018, // 1.8%
  };

  const getTilapiaFeedRate = (weight: number) => {
    const table = [
      { w: 0.01, r: 42 }, { w: 0.05, r: 23.2 }, { w: 0.1, r: 16.8 },
      { w: 0.5, r: 9.0 }, { w: 1.0, r: 8.5 }, { w: 5.0, r: 7.5 },
      { w: 10.0, r: 7.0 }, { w: 25.0, r: 5.6 }, { w: 35.0, r: 5.32 },
      { w: 50.0, r: 5.0 }, { w: 75.0, r: 4.75 }, { w: 100.0, r: 4.54 },
      { w: 150.0, r: 4.05 }, { w: 200.0, r: 3.71 }, { w: 250.0, r: 3.4 },
      { w: 300.0, r: 3.17 }, { w: 400.0, r: 2.76 }, { w: 500.0, r: 2.40 },
      { w: 600.0, r: 2.07 }, { w: 700.0, r: 1.79 }, { w: 800.0, r: 1.50 },
      { w: 900.0, r: 1.15 }, { w: 1000.0, r: 1.15 }
    ];
    
    if (weight <= table[0].w) return table[0].r / 100;
    if (weight >= table[table.length - 1].w) return table[table.length - 1].r / 100;
    
    for (let i = 0; i < table.length - 1; i++) {
      if (weight >= table[i].w && weight <= table[i+1].w) {
        const w1 = table[i].w;
        const r1 = table[i].r;
        const w2 = table[i+1].w;
        const r2 = table[i+1].r;
        const interpolatedR = r1 + ((weight - w1) / (w2 - w1)) * (r2 - r1);
        return interpolatedR / 100;
      }
    }
    return 0.025;
  };

  const getTilapiaProduct = (weight: number) => {
    if (weight <= 1) return "Nutra 0";
    if (weight <= 1.1) return "Nutra 80";
    if (weight <= 10) return "Nutra 120";
    if (weight <= 35) return "Nutra 160";
    if (weight <= 60) return "Optiline 2.0";
    if (weight <= 184) return "Optiline 3.0";
    if (weight <= 521) return "Optiline 4.5";
    return "Optiline 6.0";
  };

  const getTempMultiplier = (type: string, temp: number | "") => {
    if (temp === "") return 1; // Default if not provided
    const t = Number(temp);
    if (type === "tilapia") {
      if (t < 18) return 0;
      if (t <= 22) return 0.5;
      if (t <= 26) return 0.8;
      if (t <= 30) return 1.0;
      return 0.7; // > 30
    } else {
      // seabass and seabream
      if (t < 14) return 0;
      if (t <= 18) return 0.5;
      if (t <= 22) return 0.8;
      if (t <= 26) return 1.0;
      return 0.6; // > 26
    }
  };

  const calculateFeed = () => {
    if (!fishCount || !avgWeight) return { value: "0", unit: "جرام" };
    
    // Total biomass in grams
    const totalBiomassGrams = Number(fishCount) * Number(avgWeight);
    // Base feed in grams
    let baseFeedGrams = 0;
    
    if (fishType === "tilapia") {
      const rate = getTilapiaFeedRate(Number(avgWeight));
      baseFeedGrams = totalBiomassGrams * rate;
    } else {
      baseFeedGrams = totalBiomassGrams * feedRates[fishType as keyof typeof feedRates];
    }
    
    const multiplier = getTempMultiplier(fishType, waterTemp);
    const finalFeedGrams = baseFeedGrams * multiplier;

    if (finalFeedGrams >= 1000) {
      return { value: (finalFeedGrams / 1000).toFixed(2), unit: "كجم" };
    } else {
      // Show up to 2 decimal places for grams, removing trailing zeros
      return { value: parseFloat(finalFeedGrams.toFixed(2)).toString(), unit: "جرام" };
    }
  };

  const feedResult = calculateFeed();
  const multiplier = getTempMultiplier(fishType, waterTemp);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Hero Editorial Section */}
      <section className="relative rounded-[2rem] overflow-hidden p-8 flex flex-col justify-end min-h-[240px] shadow-lg">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="water" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5tjfQSpqXE9ozY0SEnHiPWjseg6KL4FJxVWBbyw4xWGhFupg3JbhJtWtlnNTIDrO1BJvc9Hj4yUj2hRHjEDAXPbiCeK6vDbgvuHwyo9FcQGL47s9hGT3q_HqP9T-GyPiAuP2svIo4i_-OZWvJWF3jgqcbvhMeXD2L7w_6SNVNtKXhpnEZnfxwyarTMx9IKAdGXLTV8iPUngEf2OtLE1XMSjdExhzmukTOexEt2oFCwo-X3mXoNNu_XTUyXTszA7z6rn4EghtowXY" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
        </div>
        <div className="relative z-10 space-y-2">
          <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">أداة المربي الذكي</span>
          <h2 className="text-white text-4xl font-headline font-black leading-tight">حاسبة العلف</h2>
          <p className="text-blue-50/90 max-w-md font-body">حدد بدقة احتياجات أسماكك الغذائية بناءً على معايير البيئة والنمو الحالية.</p>
        </div>
      </section>

      {/* Calculation Result Area */}
      <section className="bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 space-y-4">
            <h3 className="text-on-surface-variant font-bold text-xl flex items-center gap-2">
              <CalcIcon className="w-6 h-6 text-primary" />
              كمية العلف الموصى بها
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-headline font-black text-primary tracking-tighter">{feedResult.value}</span>
              <span className="text-2xl font-bold text-primary-container">{feedResult.unit}</span>
            </div>
            {fishType === "tilapia" && avgWeight && (
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg inline-block font-bold mt-2">
                المنتج الموصى به: {getTilapiaProduct(Number(avgWeight))}
              </div>
            )}
            <p className="text-on-surface-variant text-sm flex items-center gap-2 mt-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              هذه الكمية محسوبة لنمو مثالي وصحة مستدامة للمياه.
            </p>
          </div>
          
          {/* Signature Component: Growth Wave Visual */}
          <div className="w-full md:w-64 h-32 bg-gradient-to-br from-primary to-primary-container rounded-2xl relative overflow-hidden flex items-center justify-center">
            <svg className="absolute bottom-0 w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path d="M0 40 C 20 10, 40 35, 70 5, 100 25 L 100 40 L 0 40 Z" fill="rgba(255,255,255,0.2)"></path>
              <path d="M0 40 C 30 20, 50 30, 80 15, 100 35 L 100 40 L 0 40 Z" fill="rgba(255,255,255,0.1)"></path>
            </svg>
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-primary font-bold text-sm shadow-xl flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              معدل التحويل: 1.2
            </div>
          </div>
        </div>
      </section>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fish Type */}
        <div className="space-y-3">
          <label className="block text-on-surface font-bold pr-2">نوع السمك</label>
          <div className="relative group">
            <select 
              value={fishType}
              onChange={(e) => setFishType(e.target.value)}
              className="w-full bg-surface-container-lowest border-none ring-0 focus:ring-2 focus:ring-primary/20 rounded-xl p-4 appearance-none font-body text-on-surface shadow-sm transition-all"
            >
              <option value="tilapia">بلطي نيلى</option>
              <option value="seabass">قاروص</option>
              <option value="seabream">دنيس</option>
            </select>
            <Fish className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <label className="block text-on-surface font-bold pr-2">درجة حرارة الماء (°م)</label>
          <div className="relative">
            <input 
              type="number" 
              value={waterTemp}
              onChange={(e) => setWaterTemp(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-surface-container-lowest border-none ring-0 focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-body text-on-surface shadow-sm" 
            />
            <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Fish Count */}
        <div className="space-y-3">
          <label className="block text-on-surface font-bold pr-2">عدد الأسماك</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="مثال: 500" 
              value={fishCount}
              onChange={(e) => setFishCount(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-surface-container-lowest border-none ring-0 focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-body text-on-surface shadow-sm" 
            />
            <CalcIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Average Weight */}
        <div className="space-y-3">
          <label className="block text-on-surface font-bold pr-2">متوسط وزن السمكة (جرام)</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="مثال: 150" 
              value={avgWeight}
              onChange={(e) => setAvgWeight(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-surface-container-lowest border-none ring-0 focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-body text-on-surface shadow-sm" 
            />
            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Editorial Tips Bento Grid */}
      <section className="space-y-4">
        <h3 className="font-headline font-black text-2xl text-on-surface-variant">توصيات الموجه الذكي</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 bg-secondary/5 rounded-3xl p-6 flex flex-col justify-between border-r-4 border-secondary">
            <p className="text-secondary font-bold text-lg leading-snug">
              {waterTemp !== "" && Number(waterTemp) > 26 
                ? `في درجة حرارة ${waterTemp}°م، تزيد معدلات التمثيل الغذائي. يفضل تقسيم الوجبة إلى 3 حصص يومياً.`
                : "تأكد من توزيع العلف بالتساوي على مساحة الحوض لضمان حصول جميع الأسماك على حصتها."}
            </p>
            <div className="mt-4 flex items-center gap-2 text-secondary-container bg-secondary px-3 py-1 rounded-full self-start text-xs font-bold">
              <Info className="w-4 h-4" />
              نصيحة الخبير
            </div>
          </div>
          <div className="bg-surface-container-high rounded-3xl p-6 space-y-4">
            <Waves className="w-10 h-10 text-tertiary" />
            <h4 className="font-bold text-on-surface">جودة المياه</h4>
            <p className="text-on-surface-variant text-sm">تأكد من مستوى الأكسجين المذاب بعد عملية الإطعام بساعتين.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
