import { useState } from "react";
import { BookOpen, Activity, MessageSquare, Menu, X, Calculator as CalcIcon, Wallet } from "lucide-react";
import Education from "./components/Education";
import IoTMonitor from "./components/IoTMonitor";
import AIChat from "./components/AIChat";
import Calculator from "./components/Calculator";
import Expenses from "./components/Expenses";

type Tab = "education" | "monitor" | "chat" | "calculator" | "expenses";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("education");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "education", label: "أكاديمية الاستزراع", icon: BookOpen },
    { id: "monitor", label: "مراقبة الأحواض (IoT)", icon: Activity },
    { id: "calculator", label: "حاسبة العلف", icon: CalcIcon },
    { id: "expenses", label: "سجل المصروفات", icon: Wallet },
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
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-72 bg-slate-900 text-white flex-shrink-0 sticky top-0 md:h-screen z-40`}
      >
        <div className="p-6 hidden md:block">
          <h1 className="font-bold text-2xl text-blue-400">مرشد الاستزراع</h1>
          <p className="text-slate-400 text-sm mt-2">إدارة وتعليم للمربين الصغار</p>
        </div>

        <nav className="p-4 space-y-2">
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
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-6xl mx-auto">
          {activeTab === "education" && <Education />}
          {activeTab === "monitor" && <IoTMonitor />}
          {activeTab === "calculator" && <Calculator />}
          {activeTab === "expenses" && <Expenses />}
          {activeTab === "chat" && <AIChat />}
        </div>
      </main>
    </div>
  );
}
