import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClipboardList, Plus, Trash2, Droplets, Fish, Pill, Activity, Calendar, FileText } from "lucide-react";

type ActivityType = "feeding" | "water" | "medication" | "harvest" | "observation";

interface LogEntry {
  id: string;
  date: string;
  type: ActivityType;
  notes: string;
}

const ACTIVITY_TYPES: Record<ActivityType, { label: string; icon: any; color: string; bgColor: string }> = {
  feeding: { label: "تغذية (علف)", icon: Fish, color: "text-blue-600", bgColor: "bg-blue-100" },
  water: { label: "تغيير/فحص مياه", icon: Droplets, color: "text-cyan-600", bgColor: "bg-cyan-100" },
  medication: { label: "أدوية/علاجات", icon: Pill, color: "text-red-600", bgColor: "bg-red-100" },
  harvest: { label: "حصاد/فرز", icon: Activity, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  observation: { label: "ملاحظات عامة", icon: FileText, color: "text-amber-600", bgColor: "bg-amber-100" },
};

export default function DailyLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<ActivityType>("feeding");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("farm_daily_logs");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  const saveLogs = (newLogs: LogEntry[]) => {
    setLogs(newLogs);
    localStorage.setItem("farm_daily_logs", JSON.stringify(newLogs));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !date) return;
    
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      date,
      type,
      notes
    };
    
    const updated = [newEntry, ...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    saveLogs(updated);
    setNotes("");
  };

  const handleDelete = (id: string) => {
    saveLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          سجل العمليات اليومية
        </h2>
        <p className="text-slate-600">
          سجل أنشطتك اليومية في المزرعة مثل التغذية، تغيير المياه، وإعطاء الأدوية لمتابعة حالة الأحواض.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center text-lg">
              <Plus className="w-5 h-5 ml-2 text-blue-500" />
              إضافة عملية جديدة
            </h3>
            
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">التاريخ</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">نوع العملية</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ACTIVITY_TYPES) as ActivityType[]).map((actType) => {
                    const { label, icon: Icon, color, bgColor } = ACTIVITY_TYPES[actType];
                    const isSelected = type === actType;
                    return (
                      <button
                        key={actType}
                        type="button"
                        onClick={() => setType(actType)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          isSelected 
                            ? `border-blue-500 ${bgColor} ring-1 ring-blue-500` 
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${isSelected ? color : "text-slate-400"}`} />
                        <span className={`text-xs font-medium text-center ${isSelected ? "text-slate-900" : "text-slate-500"}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">التفاصيل / الملاحظات</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: تم إضافة 50 كيلو علف للحوض رقم 1..."
                  className="w-full h-28 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!notes.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                حفظ العملية
              </button>
            </form>
          </div>
        </div>

        {/* Logs List */}
        <div className="lg:col-span-2">
          {logs.length === 0 ? (
            <div className="h-full min-h-[300px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <ClipboardList className="w-16 h-16 mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-500">لا توجد عمليات مسجلة بعد.</p>
              <p className="text-sm mt-2">ابدأ بإضافة أول عملية من القائمة الجانبية.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {logs.map((log) => {
                  const { label, icon: Icon, color, bgColor } = ACTIVITY_TYPES[log.type];
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex gap-4 items-start group"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-slate-800">{label}</h4>
                            <div className="flex items-center text-sm text-slate-500 mt-1">
                              <Calendar className="w-4 h-4 ml-1" />
                              {new Date(log.date).toLocaleDateString('ar-EG', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="حذف"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-slate-600 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                          {log.notes}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
