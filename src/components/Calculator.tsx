import { useState } from "react";
import { motion } from "motion/react";
import { Calculator as CalcIcon, Scale, Fish, Info } from "lucide-react";

export default function Calculator() {
  const [fishType, setFishType] = useState("tilapia");
  const [fishCount, setFishCount] = useState<number | "">("");
  const [avgWeight, setAvgWeight] = useState<number | "">("");

  // Simplified feed rates based on fish type (percentage of body weight)
  const feedRates = {
    tilapia: 0.025, // 2.5%
    seabass: 0.015, // 1.5%
    seabream: 0.018, // 1.8%
  };

  const calculateFeed = () => {
    if (!fishCount || !avgWeight) return 0;
    const totalBiomassKg = (Number(fishCount) * Number(avgWeight)) / 1000;
    const dailyFeedKg = totalBiomassKg * feedRates[fishType as keyof typeof feedRates];
    return dailyFeedKg.toFixed(2);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">حاسبة كميات العلف</h2>
        <p className="text-slate-600">احسب كمية العلف اليومية المطلوبة بناءً على نوع السمك، العدد، ومتوسط الوزن.</p>
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
          <div className="text-6xl font-bold my-4 relative z-10 flex items-baseline gap-2">
            {calculateFeed()}
            <span className="text-2xl font-normal text-blue-200">كجم</span>
          </div>
          
          <div className="mt-6 bg-blue-700/50 p-4 rounded-xl flex items-start gap-3 relative z-10 text-right">
            <Info className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-100 leading-relaxed">
              هذه الحسبة تقريبية وتعتمد على نسبة {(feedRates[fishType as keyof typeof feedRates] * 100).toFixed(1)}% من وزن الكتلة الحية. يجب تعديل الكمية بناءً على درجة حرارة المياه وإقبال الأسماك على الأكل.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
