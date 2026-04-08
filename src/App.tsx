import { useState } from "react";
import { BookOpen, Activity, MessageSquare, Menu, X, Calculator as CalcIcon, Wallet, Newspaper, Stethoscope, Mail, Phone, ClipboardList } from "lucide-react";
import Education from "./components/Education";
import IoTMonitor from "./components/IoTMonitor";
import AIChat from "./components/AIChat";
import Calculator from "./components/Calculator";
import Expenses from "./components/Expenses";
import LatestUpdates from "./components/LatestUpdates";
import Diseases from "./components/Diseases";
import DailyLog from "./components/DailyLog";

type Tab = "education" | "monitor" | "chat" | "calculator" | "expenses" | "updates" | "diseases" | "dailyLog";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("education");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "education", label: "أكاديمية الاستزراع", icon: BookOpen },
    { id: "diseases", label: "دليل الأمراض", icon: Stethoscope },
    { id: "dailyLog", label: "سجل العمليات اليومي", icon: ClipboardList },
    { id: "monitor", label: "مراقبة الأحواض (IoT)", icon: Activity },
    { id: "calculator", label: "حاسبة العلف", icon: CalcIcon },
    { id: "expenses", label: "سجل المصروفات", icon: Wallet },
    { id: "updates", label: "أحدث التطورات", icon: Newspaper },
    { id: "chat", label: "المستشار الذكي", icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans text-slate-900" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="font-bold text-xl">مرشد الاستزراع</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-72 bg-slate-900 text-white flex-shrink-0 sticky top-0 md:h-screen z-40`}
      >
        <div className="p-6 hidden md:block">
          <h1 className="font-bold text-2xl text-blue-400">مرشد الاستزراع</h1>
          <p className="text-slate-400 text-sm mt-2">إدارة وتعليم للمربين الصغار</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-medium shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Contact Info Footer */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800 mt-auto">
          <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">للتواصل والدعم</p>
          <div className="space-y-4">
            <a href="mailto:Hudaabass200@gmail.com" className="flex items-center gap-3 text-sm text-slate-300 hover:text-blue-400 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-900/50 transition-colors flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="truncate" dir="ltr">Hudaabass200@gmail.com</span>
            </a>
            <a href="tel:01019547928" className="flex items-center gap-3 text-sm text-slate-300 hover:text-blue-400 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-900/50 transition-colors flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <span dir="ltr">01019547928</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-6xl mx-auto">
          {activeTab === "education" && <Education />}
          {activeTab === "diseases" && <Diseases />}
          {activeTab === "dailyLog" && <DailyLog />}
          {activeTab === "monitor" && <IoTMonitor />}
          {activeTab === "calculator" && <Calculator />}
          {activeTab === "expenses" && <Expenses />}
          {activeTab === "updates" && <LatestUpdates />}
          {activeTab === "chat" && <AIChat />}
        </div>
      </main>
    </div>
  );
}
