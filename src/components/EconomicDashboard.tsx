import { useState, useMemo } from "react";
import { Wallet, TrendingUp, AlertCircle, Info, Calculator, DollarSign, ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function EconomicDashboard() {
  const [fishType, setFishType] = useState<"tilapia" | "seabass" | "seabream">("tilapia");
  const [feedPrice, setFeedPrice] = useState<number>(26800); // EGP per ton
  const [fishPrice, setFishPrice] = useState<number>(82); // EGP per kg
  const [targetWeight, setTargetWeight] = useState<number>(500); // grams
  const [fishCount, setFishCount] = useState<number>(10000); // number of fish
  const [fingerlingCost, setFingerlingCost] = useState<number>(2.5); // EGP per fingerling
  const [otherCosts, setOtherCosts] = useState<number>(5000); // EGP for other expenses
  const [isSyncing, setIsSyncing] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const fetchMarketPrices = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/market-prices");
      if (!res.ok) throw new Error("Server communication error");
      const data = await res.json();
      setMarketData(data);
      
      // Auto-update inputs based on sync
      if (data.fish) {
        if (fishType === "tilapia") setFishPrice(data.fish.tilapia.avg);
        if (fishType === "seabass") setFishPrice(data.fish.seabass.avg);
        if (fishType === "seabream") setFishPrice(data.fish.seabream.avg);
      }
      if (data.feed) {
        setFeedPrice(data.feed.standard);
      }
    } catch (error) {
      console.error("Failed to sync prices:", error);
      setSyncError("عذراً، فشل الاتصال بخدمة الأسعار اللحظية. يرجى مراجعة الموقع الرسمي.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Standard FCR (Feed Conversion Ratio) values
  const fcrValues = {
    tilapia: 1.5,
    seabass: 1.8,
    seabream: 1.7,
  };

  const currentFcr = fcrValues[fishType];

  const applyPreset = (type: "tilapia" | "seabass" | "seabream") => {
    setFishType(type);
    if (type === "tilapia") {
      setFishCount(10000);
      setTargetWeight(500);
      setFingerlingCost(2.5);
      if (marketData?.fish?.tilapia) setFishPrice(marketData.fish.tilapia.avg);
    } else if (type === "seabass") {
      setFishCount(5000);
      setTargetWeight(600);
      setFingerlingCost(15);
      if (marketData?.fish?.seabass) setFishPrice(marketData.fish.seabass.avg);
    } else if (type === "seabream") {
      setFishCount(5000);
      setTargetWeight(450);
      setFingerlingCost(12);
      if (marketData?.fish?.seabream) setFishPrice(marketData.fish.seabream.avg);
    }
  };

  const calculations = useMemo(() => {
    const totalHarvestWeightKg = (fishCount * targetWeight) / 1000;
    const totalFeedNeededKg = totalHarvestWeightKg * currentFcr;
    const totalFeedCost = (totalFeedNeededKg * feedPrice) / 1000;
    const totalFingerlingCost = fishCount * fingerlingCost;
    const totalExpenses = totalFeedCost + totalFingerlingCost + otherCosts;
    const totalRevenue = totalHarvestWeightKg * fishPrice;
    const netProfit = totalRevenue - totalExpenses;
    const profitPerFish = netProfit / fishCount;

    return {
      totalHarvestWeightKg,
      totalFeedNeededKg,
      totalFeedCost,
      totalFingerlingCost,
      totalExpenses,
      totalRevenue,
      netProfit,
      profitPerFish,
    };
  }, [fishType, feedPrice, fishPrice, targetWeight, fishCount, fingerlingCost, otherCosts, currentFcr]);

  const alerts = useMemo(() => {
    const list = [];
    if (calculations.netProfit < 0) {
      list.push({
        type: "error",
        text: "تحذير: البيانات المدخلة تشير إلى خسارة متوقعة. يرجى مراجعة تكاليف العلف أو سعر البيع.",
      });
    } else if (calculations.netProfit > calculations.totalExpenses * 0.5) {
      list.push({
        type: "success",
        text: "مؤشر الكفاءة: الربح المتوقع ممتاز جداً مقارنة بالتكاليف (أعلى من 50%).",
      });
    }

    if (currentFcr <= 1.5) {
      list.push({
        type: "info",
        text: "تنبيه الكفاءة: بناءً على استهلاكك للعلف، معامل التحويل لديك هو " + currentFcr + "، وهو ممتاز بالنسبة لمعايير الـ FAO.",
      });
    }

    if (feedPrice > 28000) {
      list.push({
        type: "warning",
        text: "تنبيه سعر العلف: أسعار العلف حالياً مرتفعة عن المتوسط، فكر في أساليب تحسين كفاءة التغذية.",
      });
    }

    return list;
  }, [calculations, feedPrice, currentFcr]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <section className="bg-surface-container-low p-8 rounded-[2.5rem] editorial-shadow border border-outline-variant/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-container rounded-2xl">
            <Wallet className="w-8 h-8 text-on-primary-container" />
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-headline font-extrabold text-primary">المحلل الاقتصادي للاستزراع</h2>
              <p className="text-on-surface-variant font-body text-sm">احسب تكاليفك، أرباحك، وراقب كفاءة مزرعتك بذكاء.</p>
            </div>
            <button 
              onClick={fetchMarketPrices}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
              {marketData ? "تحديث الأسعار" : "مزامنة أسعار السوق"}
            </button>
          </div>
        </div>

        {syncError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl flex items-center gap-3 border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <span className="text-xs font-bold">{syncError}</span>
          </div>
        )}

        {marketData && !syncError && (
          <div className="mb-6 p-4 bg-surface-container rounded-2xl flex items-center gap-3 border border-outline-variant/10">
            <Info className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-on-surface-variant">
              تم تحديث الأسعار بنجاح من {marketData.source} (تاريخ: {new Date(marketData.lastUpdated).toLocaleDateString("ar-EG")})
            </span>
          </div>
        )}

        {/* Quick Presets */}
        <div className="mt-8">
          <p className="text-xs font-bold text-on-surface-variant mb-3">دورة سريعة بنقرة واحدة:</p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => applyPreset("tilapia")}
              className="px-4 py-2 bg-surface-container-highest hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all border border-outline-variant/10"
            >
              🐟 دورة بلطي (10 آلاف سمكة)
            </button>
            <button 
              onClick={() => applyPreset("seabream")}
              className="px-4 py-2 bg-surface-container-highest hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all border border-outline-variant/10"
            >
              🐠 دورة دنيس (5 آلاف سمكة)
            </button>
            <button 
              onClick={() => applyPreset("seabass")}
              className="px-4 py-2 bg-surface-container-highest hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all border border-outline-variant/10"
            >
              🐡 دورة قاروص (5 آلاف سمكة)
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" /> نوع السمك
            </label>
            <select
              value={fishType}
              onChange={(e) => setFishType(e.target.value as any)}
              className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface font-bold outline-none"
            >
              <option value="tilapia">بلطي</option>
              <option value="seabass">قاروص</option>
              <option value="seabream">دنيس</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" /> سعر طن العلف اليوم (جنيه)
            </label>
            <input
              type="number"
              value={feedPrice}
              onChange={(e) => setFeedPrice(Number(e.target.value))}
              className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface font-bold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> سعر الكيلو في السوق (جنيه)
            </label>
            <input
              type="number"
              value={fishPrice}
              onChange={(e) => setFishPrice(Number(e.target.value))}
              className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface font-bold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> الوزن المستهدف للحصاد (جرام)
            </label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface font-bold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> عدد الأسماك
            </label>
            <input
              type="number"
              value={fishCount}
              onChange={(e) => setFishCount(Number(e.target.value))}
              className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface font-bold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" /> تكلفة الزريعة للواحدة (جنيه)
            </label>
            <input
              type="number"
              value={fingerlingCost}
              onChange={(e) => setFingerlingCost(Number(e.target.value))}
              className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface font-bold outline-none"
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface p-8 rounded-[2.5rem] border border-outline-variant/10 editorial-shadow">
          <h3 className="text-xl font-headline font-bold text-primary mb-6">نتائج الجدوى الاقتصادية</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
              <span className="text-on-surface-variant text-sm">وزن الحصاد الكلي</span>
              <span className="text-lg font-bold text-primary">{Math.round(calculations.totalHarvestWeightKg).toLocaleString()} كجم</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
              <span className="text-on-surface-variant text-sm">إجمالي العلف المطلوب</span>
              <span className="text-lg font-bold text-primary">{Math.round(calculations.totalFeedNeededKg).toLocaleString()} كجم</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
              <span className="text-on-surface-variant text-sm">إجمالي التكاليف (علف + زريعة + أخرى)</span>
              <span className="text-lg font-bold text-error">{Math.round(calculations.totalExpenses).toLocaleString()} ج.م</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
              <span className="text-on-surface-variant text-sm">إجمالي المبيعات المتوقعة</span>
              <span className="text-lg font-bold text-primary">{Math.round(calculations.totalRevenue).toLocaleString()} ج.م</span>
            </div>

            <div className="p-6 rounded-[2rem] bg-primary text-on-primary shadow-lg shadow-primary/20 flex flex-col items-center">
              <span className="text-sm font-medium opacity-80 mb-2">صافي الربح المتوقع</span>
              <span className="text-4xl font-extrabold tracking-tight">
                {Math.round(calculations.netProfit).toLocaleString()} ج.م
              </span>
              <div className="mt-4 flex items-center gap-2 text-xs opacity-90">
                {calculations.netProfit >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>ربح بمعدل {Math.round((calculations.netProfit / calculations.totalExpenses) * 100)}% من رأس المال التشغيلي</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-headline font-bold text-primary px-4">تنبيهات أكورا الذكية ✨</h3>
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className={`p-5 rounded-[1.5rem] flex items-start gap-4 editorial-shadow ${
                    alert.type === "success" 
                      ? "bg-green-50 border border-green-100 text-green-800" 
                      : alert.type === "error"
                      ? "bg-red-50 border border-red-100 text-red-800"
                      : "bg-surface-container text-on-surface"
                  }`}
                >
                  <AlertCircle className={`w-6 h-6 mt-0.5 shrink-0 ${
                    alert.type === "success" ? "text-green-500" : alert.type === "error" ? "text-red-500" : "text-primary"
                  }`} />
                  <p className="text-sm font-medium leading-relaxed">{alert.text}</p>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center text-on-surface-variant text-sm bg-surface-container rounded-[2rem] border-2 border-dashed border-outline-variant/30">
                لا توجد تنبيهات حالياً. ابدأ بإدخال البيانات.
              </div>
            )}

            {/* Price reference info */}
            <div className="bg-surface-container-high/50 p-6 rounded-[2rem] border border-outline-variant/10">
              <h4 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> مراجع الأسعار والبيانات الرسمية
              </h4>
              <ul className="space-y-3">
                <li className="text-xs text-on-surface-variant flex items-center justify-between">
                  <span>أسعار سوق العبور اليوم</span>
                  <div className="flex gap-2">
                    <a href="https://www.obourmarket.org.eg/prices/today/1/3/0/0/0/0/0" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">الموقع الرسمي</a>
                    <span className="text-outline-variant">|</span>
                    <a href="https://www.google.com/search?q=%D8%A3%D8%B3%D8%B1%D8%A7%D8%B9+%D8%A7%D9%84%D8%B3%D9%85%D9%83+%D8%A7%D9%84%D9%8A%D9%88%D9%85+%D8%B3%D9%88%D9%82+%D8%A7%D9%84%D8%B9%D8%A8%D9%88%D8%B1" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold text-[10px]">بحث جوجل</a>
                  </div>
                </li>
                <li className="text-xs text-on-surface-variant flex items-center justify-between">
                  <span>بوابة الأسعار المحلية (العلف)</span>
                  <a href="https://prices.idsc.gov.eg/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">زيارة البوابة</a>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <p className="text-[10px] text-on-surface-variant leading-relaxed italic">
                  * ملاحظة: الأسعار المعروضة هي "متوسطات إرشادية" للسوق المصري (أبريل 2026). يرجى التأكد من التاجر المحلي قبل إتمام أي صفقات.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
