import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Droplets, Thermometer, Settings, X, AlertTriangle, CheckCircle2, WifiOff } from "lucide-react";

const generateInitialData = () => {
  const now = new Date();
  return Array.from({ length: 10 }).map((_, i) => {
    const time = new Date(now.getTime() - (9 - i) * 5000);
    return {
      time: time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      pi1_temp: 27, pi1_ph: 7.2,
      pi2_temp: 24, pi2_ph: 8.0,
      pi3_temp: 22, pi3_ph: 8.1,
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

      const fetchPi = async (url: string, mockTemp: number, mockPh: number, piKey: 'pi1'|'pi2'|'pi3') => {
        if (!url) {
          setStatus(prev => ({ ...prev, [piKey]: 'mock' }));
          return { temp: mockTemp, ph: mockPh };
        }
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error("Network error");
          const json = await res.json();
          setStatus(prev => ({ ...prev, [piKey]: 'connected' }));
          return { 
            temp: json.temp ?? json.temperature ?? mockTemp, 
            ph: json.ph ?? json.pH ?? mockPh 
          };
        } catch (error) {
          setStatus(prev => ({ ...prev, [piKey]: 'error' }));
          return { temp: mockTemp, ph: mockPh }; // Fallback to mock on error to keep chart moving
        }
      };

      const [pi1, pi2, pi3] = await Promise.all([
        fetchPi(apiUrls.pi1, 27 + Math.random() * 2, 7.2 + Math.random() * 0.5, 'pi1'),
        fetchPi(apiUrls.pi2, 24 + Math.random() * 1.5, 8.0 + Math.random() * 0.3, 'pi2'),
        fetchPi(apiUrls.pi3, 22 + Math.random() * 1.5, 8.1 + Math.random() * 0.3, 'pi3'),
      ]);

      setData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: timeStr,
          pi1_temp: pi1.temp, pi1_ph: pi1.ph,
          pi2_temp: pi2.temp, pi2_ph: pi2.ph,
          pi3_temp: pi3.temp, pi3_ph: pi3.ph,
        });
        return newData;
      });
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [apiUrls]);

  const piConfig = {
    1: { name: "Pi 1: حوض البلطي", color: "#3b82f6", tempKey: "pi1_temp", phKey: "pi1_ph", idealTemp: "25-30°C", idealPh: "6.5-9.0", key: "pi1" },
    2: { name: "Pi 2: حوض القاروص", color: "#10b981", tempKey: "pi2_temp", phKey: "pi2_ph", idealTemp: "22-28°C", idealPh: "7.5-8.5", key: "pi2" },
    3: { name: "Pi 3: حوض الدنيس", color: "#8b5cf6", tempKey: "pi3_temp", phKey: "pi3_ph", idealTemp: "18-26°C", idealPh: "7.5-8.5", key: "pi3" },
  };

  const currentConfig = piConfig[activePi];
  const latestData = data[data.length - 1];
  const currentTemp = latestData[currentConfig.tempKey as keyof typeof latestData] as number;
  const currentPh = latestData[currentConfig.phKey as keyof typeof latestData] as number;
  const currentStatus = status[currentConfig.key as keyof typeof status];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">لوحة تحكم أجهزة Raspberry Pi</h2>
          <p className="text-slate-600">مراقبة جودة المياه لحظياً في الأحواض الثلاثة.</p>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 p-3 rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">إعدادات الربط (APIs)</span>
        </button>
      </div>

      {showSettings && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 p-6 rounded-2xl shadow-lg text-white mb-8 relative"
        >
          <button 
            onClick={() => setShowSettings(false)}
            className="absolute top-4 left-4 text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            ربط أجهزة Raspberry Pi
          </h3>
          <p className="text-slate-300 mb-6 text-sm">
            أدخل روابط الـ APIs الخاصة بكل جهاز. يجب أن يُرجع الرابط بيانات بصيغة JSON تحتوي على <code className="bg-slate-700 px-2 py-1 rounded text-blue-300" dir="ltr">{"{"}"temp": 25.5, "ph": 7.2{"}"}</code>.
          </p>
          
          <div className="space-y-4">
            {([1, 2, 3] as const).map((num) => {
              const conf = piConfig[num];
              return (
                <div key={num}>
                  <label className="block text-sm font-medium text-slate-300 mb-1">{conf.name} API URL</label>
                  <input
                    type="url"
                    dir="ltr"
                    value={apiUrls[conf.key as keyof typeof apiUrls]}
                    onChange={(e) => setApiUrls({...apiUrls, [conf.key]: e.target.value})}
                    placeholder="http://192.168.1.101:5000/api/data"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSaveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              حفظ الإعدادات
            </button>
          </div>
        </motion.div>
      )}

      {/* Pi Selector */}
      <div className="flex flex-wrap gap-4">
        {([1, 2, 3] as const).map((num) => {
          const s = status[piConfig[num].key as keyof typeof status];
          return (
            <button
              key={num}
              onClick={() => setActivePi(num)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${
                activePi === num
                  ? "bg-slate-800 text-white shadow-lg scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Activity className={`w-5 h-5 ml-2 ${activePi === num ? "text-blue-400" : "text-slate-400"}`} />
              {piConfig[num].name}
              {s === 'connected' && <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />}
              {s === 'error' && <WifiOff className="w-4 h-4 mr-2 text-red-500" />}
              {s === 'mock' && <span className="mr-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">تجريبي</span>}
            </button>
          )
        })}
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          key={`temp-${activePi}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden"
        >
          {currentStatus === 'error' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          )}
          <div>
            <p className="text-slate-500 font-medium mb-1">درجة الحرارة الحالية</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-800">{currentTemp.toFixed(1)}°C</h3>
            </div>
            <p className="text-sm text-slate-400 mt-2">المثالي: {currentConfig.idealTemp}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
            <Thermometer className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          key={`ph-${activePi}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden"
        >
          {currentStatus === 'error' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          )}
          <div>
            <p className="text-slate-500 font-medium mb-1">الأس الهيدروجيني (pH)</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-800">{currentPh.toFixed(2)}</h3>
            </div>
            <p className="text-sm text-slate-400 mt-2">المثالي: {currentConfig.idealPh}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">سجل القراءات</h3>
          {currentStatus === 'error' && (
            <div className="flex items-center text-red-500 text-sm bg-red-50 px-3 py-1 rounded-full">
              <AlertTriangle className="w-4 h-4 ml-1" />
              فشل الاتصال بالـ API (يتم عرض بيانات محاكاة)
            </div>
          )}
        </div>
        <div className="h-80 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={currentConfig.tempKey}
                name="درجة الحرارة (°C)"
                stroke={currentConfig.color}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={currentConfig.phKey}
                name="pH"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
