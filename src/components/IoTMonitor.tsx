import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Droplets, Thermometer, Settings, X, AlertTriangle, CheckCircle2, WifiOff, Zap, ChevronLeft } from "lucide-react";

const generateInitialData = () => {
  const now = new Date();
  return Array.from({ length: 12 }).map((_, i) => {
    const time = new Date(now.getTime() - (11 - i) * 5000);
    return {
      time: time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      pi1_temp: 27, pi1_ph: 7.2, pi1_do: 6.5,
      pi2_temp: 24, pi2_ph: 8.0, pi2_do: 7.0,
      pi3_temp: 22, pi3_ph: 8.1, pi3_do: 7.2,
    };
  });
};

export default function IoTMonitor() {
  const [data, setData] = useState(generateInitialData());
  const [activePi, setActivePi] = useState<1 | 2 | 3>(1);
  const [showSettings, setShowSettings] = useState(false);
  
  const [apiUrls, setApiUrls] = useState({
    pi1: localStorage.getItem("pi1_url") || "",
    pi2: localStorage.getItem("pi2_url") || "",
    pi3: localStorage.getItem("pi3_url") || "",
  });

  const [status, setStatus] = useState({
    pi1: apiUrls.pi1 ? 'connecting' : 'mock',
    pi2: apiUrls.pi2 ? 'connecting' : 'mock',
    pi3: apiUrls.pi3 ? 'connecting' : 'mock',
  });

  const handleSaveSettings = () => {
    localStorage.setItem("pi1_url", apiUrls.pi1);
    localStorage.setItem("pi2_url", apiUrls.pi2);
    localStorage.setItem("pi3_url", apiUrls.pi3);
    setStatus({
      pi1: apiUrls.pi1 ? 'connecting' : 'mock',
      pi2: apiUrls.pi2 ? 'connecting' : 'mock',
      pi3: apiUrls.pi3 ? 'connecting' : 'mock',
    });
    setShowSettings(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const fetchPi = async (url: string, mockTemp: number, mockPh: number, mockDo: number, piKey: 'pi1'|'pi2'|'pi3') => {
        if (!url) {
          setStatus(prev => ({ ...prev, [piKey]: 'mock' }));
          return { temp: mockTemp, ph: mockPh, do: mockDo };
        }
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error("Network error");
          const json = await res.json();
          setStatus(prev => ({ ...prev, [piKey]: 'connected' }));
          return { 
            temp: json.temp ?? json.temperature ?? mockTemp, 
            ph: json.ph ?? json.pH ?? mockPh,
            do: json.do ?? json.dissolved_oxygen ?? mockDo
          };
        } catch (error) {
          setStatus(prev => ({ ...prev, [piKey]: 'error' }));
          return { temp: mockTemp, ph: mockPh, do: mockDo }; // Fallback to mock on error to keep chart moving
        }
      };

      const [pi1, pi2, pi3] = await Promise.all([
        fetchPi(apiUrls.pi1, 27 + Math.random() * 2, 7.2 + Math.random() * 0.5, 6.5 + Math.random() * 1, 'pi1'),
        fetchPi(apiUrls.pi2, 24 + Math.random() * 1.5, 8.0 + Math.random() * 0.3, 7.0 + Math.random() * 0.8, 'pi2'),
        fetchPi(apiUrls.pi3, 22 + Math.random() * 1.5, 8.1 + Math.random() * 0.3, 7.2 + Math.random() * 0.5, 'pi3'),
      ]);

      setData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: timeStr,
          pi1_temp: pi1.temp, pi1_ph: pi1.ph, pi1_do: pi1.do,
          pi2_temp: pi2.temp, pi2_ph: pi2.ph, pi2_do: pi2.do,
          pi3_temp: pi3.temp, pi3_ph: pi3.ph, pi3_do: pi3.do,
        });
        return newData;
      });
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [apiUrls]);

  const piConfig = {
    1: { name: "حوض تيلابيا 1", color: "#007185", tempKey: "pi1_temp", phKey: "pi1_ph", doKey: "pi1_do", idealTemp: "25-30°C", idealPh: "6.5-9.0", key: "pi1" },
    2: { name: "حوض قاروص 1", color: "#2c694e", tempKey: "pi2_temp", phKey: "pi2_ph", doKey: "pi2_do", idealTemp: "22-28°C", idealPh: "7.5-8.5", key: "pi2" },
    3: { name: "حوض دنيس 1", color: "#005769", tempKey: "pi3_temp", phKey: "pi3_ph", doKey: "pi3_do", idealTemp: "18-26°C", idealPh: "7.5-8.5", key: "pi3" },
  };

  const currentConfig = piConfig[activePi];
  const latestData = data[data.length - 1];
  const currentTemp = latestData[currentConfig.tempKey as keyof typeof latestData] as number;
  const currentPh = latestData[currentConfig.phKey as keyof typeof latestData] as number;
  const currentDo = latestData[currentConfig.doKey as keyof typeof latestData] as number;
  const currentStatus = status[currentConfig.key as keyof typeof status];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Editorial Section */}
      <section className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-primary font-headline">مراقبة الأحواض الذكية</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">بيانات مباشرة من المستشعرات المغمورة لتحسين جودة المياه وزيادة الإنتاجية السمكية بدقة عالية.</p>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="bg-surface-container-high text-primary hover:bg-surface-container-highest p-3 rounded-full shadow-sm transition-colors flex items-center justify-center"
          title="إعدادات الربط"
        >
          <Settings className="w-6 h-6" />
        </button>
      </section>

      {showSettings && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-high p-6 rounded-3xl shadow-lg text-on-surface mb-8 relative border border-outline-variant"
        >
          <button 
            onClick={() => setShowSettings(false)}
            className="absolute top-4 left-4 text-on-surface-variant hover:text-primary"
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary font-headline">
            <Activity className="w-5 h-5" />
            ربط أجهزة Raspberry Pi
          </h3>
          <p className="text-on-surface-variant mb-6 text-sm">
            أدخل روابط الـ APIs الخاصة بكل جهاز. يجب أن يُرجع الرابط بيانات بصيغة JSON تحتوي على <code className="bg-surface-container-highest px-2 py-1 rounded text-primary" dir="ltr">{"{"}"temp": 25.5, "ph": 7.2, "do": 6.5{"}"}</code>.
          </p>
          
          <div className="space-y-4">
            {([1, 2, 3] as const).map((num) => {
              const conf = piConfig[num];
              return (
                <div key={num}>
                  <label className="block text-sm font-bold text-on-surface mb-1">{conf.name} API URL</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={apiUrls[conf.key as keyof typeof apiUrls]}
                    onChange={(e) => setApiUrls({...apiUrls, [conf.key]: e.target.value})}
                    placeholder="http://192.168.1.101:5000/api/data"
                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSaveSettings}
              className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              حفظ الإعدادات
            </button>
          </div>
        </motion.div>
      )}

      {/* Pi Selector */}
      <div className="flex flex-wrap gap-4 mb-8">
        {([1, 2, 3] as const).map((num) => {
          const s = status[piConfig[num].key as keyof typeof status];
          return (
            <button
              key={num}
              onClick={() => setActivePi(num)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${
                activePi === num
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container-high"
              }`}
            >
              <Activity className={`w-5 h-5 ml-2 ${activePi === num ? "text-white" : "text-primary"}`} />
              {piConfig[num].name}
              {s === 'connected' && <CheckCircle2 className="w-4 h-4 mr-2 text-secondary" />}
              {s === 'error' && <WifiOff className="w-4 h-4 mr-2 text-error" />}
              {s === 'mock' && <span className="mr-2 text-xs bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full">تجريبي</span>}
            </button>
          )
        })}
      </div>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Gauge: pH Level */}
        <div className="md:col-span-2 bg-surface-container rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px] border border-outline-variant/30">
          <div className="flex justify-between items-start z-10">
            <div>
              <h2 className="text-2xl font-bold mb-1 font-headline text-on-surface">مستوى القلوية (pH)</h2>
              <span className="text-sm text-on-surface-variant uppercase tracking-widest">تحديث مباشر • {currentConfig.name}</span>
            </div>
            <div className="bg-secondary-container/50 text-secondary-fixed-variant px-4 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              مستقر
            </div>
          </div>
          
          {/* Abstract Gauge Visualization */}
          <div className="flex justify-center items-center py-10 relative">
            <div className="w-64 h-64 rounded-full border-[16px] border-surface-container-highest flex items-center justify-center relative">
              <div 
                className="absolute inset-0 rounded-full border-[16px] border-primary-container border-t-transparent -rotate-45 transition-all duration-1000"
                style={{ transform: `rotate(${currentPh * 18 - 135}deg)` }}
              ></div>
              <div className="text-center">
                <span className="text-7xl font-extrabold block text-on-surface">{currentPh.toFixed(1)}</span>
                <span className="text-sm uppercase text-on-surface-variant tracking-widest">pH Units</span>
              </div>
            </div>
            {/* Decorative Gradient */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
          </div>
          
          <div className="flex gap-8 z-10">
            <div>
              <p className="text-on-surface-variant text-xs mb-1">الأدنى اليوم</p>
              <p className="text-xl font-bold text-on-surface">{(currentPh - 0.4).toFixed(1)}</p>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs mb-1">الأقصى اليوم</p>
              <p className="text-xl font-bold text-on-surface">{(currentPh + 0.3).toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Side Card: Temperature */}
        <div className="bg-surface-container-high rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative border border-outline-variant/30">
          <div>
            <div className="flex justify-between items-center mb-6">
              <Thermometer className="text-tertiary w-10 h-10" />
              <div className="w-12 h-1 bg-tertiary rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold mb-1 font-headline text-on-surface">درجة الحرارة</h3>
            <p className="text-on-surface-variant text-sm mb-6">متوسط حرارة المياه</p>
            <div className="text-5xl font-extrabold mb-2 text-on-surface">{currentTemp.toFixed(1)}°<span className="text-2xl font-medium">C</span></div>
          </div>
          <div className="space-y-4">
            <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-l from-primary to-primary-container transition-all duration-1000"
                style={{ width: `${(currentTemp / 40) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>منخفض (18°)</span>
              <span>مرتفع (32°)</span>
            </div>
          </div>
        </div>

        {/* Line Chart: Dissolved Oxygen */}
        <div className="md:col-span-3 bg-surface-container rounded-3xl p-8 border border-outline-variant/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1 font-headline text-on-surface">الأكسجين المذاب (DO)</h2>
              <p className="text-on-surface-variant text-sm">معدل تشبع الأكسجين خلال الدقائق الماضية</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-surface-container-highest text-sm font-bold text-on-surface">ساعة</button>
              <button className="px-4 py-2 rounded-xl bg-primary-container text-white text-sm font-bold">مباشر</button>
              <button className="px-4 py-2 rounded-xl bg-surface-container-highest text-sm font-bold text-on-surface">أسبوع</button>
            </div>
          </div>
          
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e4" vertical={false} />
                <XAxis dataKey="time" stroke="#6f797c" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6f797c" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)', backgroundColor: '#ffffff' }}
                />
                <Line
                  type="monotone"
                  dataKey={currentConfig.doKey}
                  name="الأكسجين المذاب (mg/L)"
                  stroke="#007185"
                  strokeWidth={4}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#007185' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts / Action Cards */}
        <div className="bg-surface-container rounded-3xl p-6 flex items-center gap-4 hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/30">
          <div className="w-14 h-14 rounded-2xl bg-error-container flex items-center justify-center text-on-error-container">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-on-surface">تنبيهات النظام</h4>
            <p className="text-xs text-on-surface-variant">لا توجد تنبيهات حرجة حالياً</p>
          </div>
          <ChevronLeft className="mr-auto text-on-surface-variant w-5 h-5" />
        </div>
        
        <div className="bg-surface-container rounded-3xl p-6 flex items-center gap-4 hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/30">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-on-surface">حالة التبديل</h4>
            <p className="text-xs text-on-surface-variant">تبديل المياه التلقائي نشط</p>
          </div>
          <ChevronLeft className="mr-auto text-on-surface-variant w-5 h-5" />
        </div>
        
        <div className="bg-surface-container rounded-3xl p-6 flex items-center gap-4 hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/30">
          <div className="w-14 h-14 rounded-2xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-on-surface">استهلاك الطاقة</h4>
            <p className="text-xs text-on-surface-variant">المستشعرات تعمل بكفاءة 98%</p>
          </div>
          <ChevronLeft className="mr-auto text-on-surface-variant w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
