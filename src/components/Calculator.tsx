import { useState } from "react";
import { motion } from "motion/react";
import { Calculator as CalcIcon, Scale, Fish, Info, Thermometer } from "lucide-react";

export default function Calculator() {
  const [fishType, setFishType] = useState("tilapia");
  const [fishCount, setFishCount] = useState<number | "">("");
  const [avgWeight, setAvgWeight] = useState<number | "">("");
  const [waterTemp, setWaterTemp] = useState<number | "">("");

  // Simplified feed rates based on fish type (percentage of body weight)
  const feedRates = {
    tilapia: 0.025, // 2.5%
    seabass: 0.015, // 1.5%
    seabream: 0.018, // 1.8%
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
    const baseFeedGrams = totalBiomassGrams * feedRates[fishType as keyof typeof feedRates];
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">حاسبة كميات العلف</h2>
        <p className="text-slate-600">احسب كمية العلف اليومية المطلوبة بناءً على نوع السمك، العدد، متوسط الوزن، ودرجة حرارة المياه.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">نوع السمك</label>
            <div className="relative">
              <Fish className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={fishType}
                onChange={(e) => setFishType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="tilapia">البلطي</option>
                <option value="seabass">القاروص</option>
                <option value="seabream">الدنيس</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">العدد الكلي للأسماك في الحوض</label>
            <input
              type="number"
              min="0"
              value={fishCount}
              onChange={(e) => setFishCount(e.target.value ? Number(e.target.value) : "")}
              placeholder="مثال: 1000"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">متوسط وزن السمكة الواحدة (بالجرام)</label>
            <div className="relative">
              <Scale className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                min="0"
                value={avgWeight}
                onChange={(e) => setAvgWeight(e.target.value ? Number(e.target.value) : "")}
                placeholder="مثال: 50"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">درجة حرارة المياه الحالية (°C)</label>
              <div className="group relative cursor-help">
                <Info className="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-right shadow-xl">
                  تؤثر درجة الحرارة بشكل مباشر على شهية الأسماك وعملية الأيض. في درجات الحرارة المنخفضة أو المرتفعة جداً، يقل استهلاك العلف، لذا تقوم الحاسبة بتعديل الكمية تلقائياً لتجنب تلوث المياه وهدر العلف.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Thermometer className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                min="0"
                max="45"
                value={waterTemp}
                onChange={(e) => setWaterTemp(e.target.value ? Number(e.target.value) : "")}
                placeholder="مثال: 26"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-center items-center text-center relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 opacity-10">
            <CalcIcon className="w-48 h-48" />
          </div>
          
          <h3 className="text-xl font-medium text-blue-100 mb-2 relative z-10">كمية العلف اليومية المقترحة</h3>
          
          {multiplier === 0 && waterTemp !== "" ? (
            <div className="my-6 relative z-10 bg-red-500/20 border border-red-400/50 p-4 rounded-xl">
              <p className="text-lg font-bold text-white">توقف عن التغذية!</p>
              <p className="text-sm text-red-100 mt-1">درجة الحرارة الحالية غير مناسبة لتقديم العلف لهذا النوع من الأسماك.</p>
            </div>
          ) : (
            <div className="text-6xl font-bold my-4 relative z-10 flex items-baseline gap-2">
              {feedResult.value}
              <span className="text-2xl font-normal text-blue-200">{feedResult.unit}</span>
            </div>
          )}
          
          <div className="mt-6 bg-blue-700/50 p-4 rounded-xl flex items-start gap-3 relative z-10 text-right w-full">
            <Info className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-100 leading-relaxed">
              <p>
                النسبة الأساسية: {(feedRates[fishType as keyof typeof feedRates] * 100).toFixed(1)}% من وزن الكتلة الحية.
              </p>
              {waterTemp !== "" && multiplier > 0 && multiplier < 1 && (
                <p className="mt-1 text-orange-200 font-medium">
                  تم تقليل الكمية بنسبة {Math.round((1 - multiplier) * 100)}% لتناسب درجة حرارة المياه الحالية ({waterTemp}°C).
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
