import { useState } from "react";
import { BookOpen, Activity, MessageSquare, Menu, X, Calculator as CalcIcon, Wallet, Newspaper, Stethoscope, ClipboardList, Sprout, Bell, Camera } from "lucide-react";
import IoTMonitor from "./components/IoTMonitor";
import AIChat from "./components/AIChat";
import Calculator from "./components/Calculator";
import Expenses from "./components/Expenses";
import LatestUpdates from "./components/LatestUpdates";
import Diseases from "./components/Diseases";
import DailyLog from "./components/DailyLog";
import StartFromScratch from "./components/StartFromScratch";

type Tab = "start" | "monitor" | "chat" | "calculator" | "expenses" | "updates" | "diseases" | "dailyLog";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("start");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "start", label: "تعلم من الصفر", icon: Sprout },
    { id: "diseases", label: "دليل الأمراض", icon: Stethoscope },
    { id: "dailyLog", label: "سجل العمليات اليومي", icon: ClipboardList },
    { id: "monitor", label: "مراقبة الأحواض", icon: Activity },
    { id: "calculator", label: "حاسبة العلف", icon: CalcIcon },
    { id: "expenses", label: "سجل المصروفات", icon: Wallet },
    { id: "updates", label: "أحدث التطورات", icon: Newspaper },
    { id: "chat", label: "المستشار الذكي", icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans" dir="rtl">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface transition-colors border-b border-outline-variant/15">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden relative block">
            <img className="w-full h-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcA4oCeFHmHCY-D-EibZkxng-00cYd97inGKxNAd_NFFyt7lWZfihdjPpwBAUh-MXHHJm5P0TszYrGMuGJ1ArknkJGO_K0tmBrC8bdYISr5ztSIpb180KVSs3YIMumhBk5MgyadUHzk9U3C1RdOemgxYYqrK2qyICvihDKpcMqenAiO3pNzUJuUyfs-g5HSJVpRuHuEe1PG25Z2RNV4R4eSQYj_SgSxnZBScXvsj4F9knkiUl9IpgFBU0_Khs0HLrvmOLGXCnvocA" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight">مرشد الاستزراع</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <Bell className="w-5 h-5 text-primary" />
          </button>
          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </header>

      {/* Side Navigation Drawer (Desktop) */}
      <aside className="fixed right-0 top-0 h-full z-40 hidden md:flex flex-col p-4 w-72 bg-surface rounded-l-3xl shadow-2xl shadow-on-surface/5 mt-16 border-l border-outline-variant/15">
        <div className="mb-8 px-4 py-6 border-b border-outline-variant/15">
          <p className="text-primary font-bold text-lg">مدير المزرعة</p>
          <p className="text-on-surface-variant text-xs">مستوى مبتدئ</p>
        </div>
        <nav className="flex flex-col gap-2 overflow-y-auto pb-24">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary-container/10 text-primary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-on-surface-variant"}`} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-sm pt-20 px-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary-container/10 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-on-surface-variant"}`} />
                  <span className="text-lg">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="md:mr-72 pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        {activeTab === "start" && <StartFromScratch setActiveTab={setActiveTab} />}
        {activeTab === "diseases" && <Diseases />}
        {activeTab === "dailyLog" && <DailyLog />}
        {activeTab === "monitor" && <IoTMonitor />}
        {activeTab === "calculator" && <Calculator />}
        {activeTab === "expenses" && <Expenses />}
        {activeTab === "updates" && <LatestUpdates />}
        {activeTab === "chat" && <AIChat />}
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2rem] border-t border-outline-variant/15">
        <button onClick={() => setActiveTab("start")} className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${activeTab === "start" ? "text-primary scale-110" : "text-outline opacity-60 hover:opacity-100"}`}>
          <Sprout className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest mt-1">الرئيسية</span>
        </button>
        <button onClick={() => setActiveTab("monitor")} className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${activeTab === "monitor" ? "text-primary scale-110" : "text-outline opacity-60 hover:opacity-100"}`}>
          <Activity className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest mt-1">المراقبة</span>
        </button>
        <button onClick={() => setActiveTab("dailyLog")} className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${activeTab === "dailyLog" ? "text-primary scale-110" : "text-outline opacity-60 hover:opacity-100"}`}>
          <ClipboardList className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest mt-1">السجلات</span>
        </button>
        <button onClick={() => setActiveTab("chat")} className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${activeTab === "chat" ? "text-primary scale-110" : "text-outline opacity-60 hover:opacity-100"}`}>
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest mt-1">المساعد</span>
        </button>
      </nav>

      {/* FAB */}
      <button 
        onClick={() => setActiveTab("chat")}
        className="fixed bottom-24 left-6 md:left-12 z-50 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all"
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    </div>
  );
}
