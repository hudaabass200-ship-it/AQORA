import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, PlusCircle, Save, Utensils, Waves, Zap, Trash2, TrendingUp } from "lucide-react";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  notes: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", date: new Date().toISOString().split('T')[0], category: "أعلاف", amount: 2200, notes: "أعلاف بروتين 30%" },
    { id: "2", date: new Date().toISOString().split('T')[0], category: "زريعة", amount: 1800, notes: "زريعة بلطي سوبر" },
    { id: "3", date: new Date().toISOString().split('T')[0], category: "فواتير", amount: 500, notes: "فاتورة كهرباء" },
  ]);

  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !category) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category,
      amount: Number(amount),
      notes,
    };

    setExpenses([newExpense, ...expenses]);
    setAmount("");
    setNotes("");
    setCategory("");
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "أعلاف": return <Utensils className="w-6 h-6" />;
      case "زريعة": return <Waves className="w-6 h-6" />;
      case "فواتير": return <Zap className="w-6 h-6" />;
      default: return <Wallet className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "أعلاف": return "bg-secondary-container/20 text-on-secondary-container";
      case "زريعة": return "bg-tertiary-fixed/30 text-on-tertiary-fixed-variant";
      case "فواتير": return "bg-surface-container-highest text-tertiary";
      default: return "bg-primary-container/20 text-on-primary-container";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Page Title & Hero Summary */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-tertiary text-sm font-medium block mb-1">الإدارة المالية</span>
            <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">سجل المصروفات</h2>
          </div>
        </div>

        {/* Bento Summary Card */}
        <div className="liquid-gradient rounded-[2rem] p-8 text-white editorial-shadow relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 opacity-90">
              <Wallet className="w-6 h-6" />
              <span className="text-sm font-medium">إجمالي مصروفات الشهر</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tighter">{totalExpenses.toLocaleString()}</span>
              <span className="text-xl font-medium opacity-80">ج.م</span>
            </div>
            <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
              <TrendingUp className="w-4 h-4 text-secondary-fixed" />
              <span className="text-xs">زيادة 12% عن الشهر الماضي</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Form Section */}
        <section className="lg:col-span-1">
          <div className="bg-surface-container-low rounded-[1.5rem] p-6 sticky top-24">
            <h3 className="text-lg font-headline font-bold mb-5 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-primary" />
              إضافة مصروف جديد
            </h3>
            <form className="space-y-5" onSubmit={handleAddExpense}>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-2 px-1">المبلغ</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-lg font-bold placeholder:text-outline-variant outline-none transition-all" 
                  placeholder="0.00" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-2 px-1">الفئة</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 text-on-surface appearance-none outline-none transition-all"
                  required
                >
                  <option value="">اختر الفئة</option>
                  <option value="أعلاف">أعلاف</option>
                  <option value="زريعة">زريعة</option>
                  <option value="أدوات وصيانة">أدوات وصيانة</option>
                  <option value="فواتير">كهرباء ومياه (فواتير)</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-2 px-1">تفاصيل إضافية (اختياري)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant outline-none transition-all" 
                  placeholder="مثال: توريد أعلاف الشركة الوطنية" 
                  rows={2}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full liquid-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex justify-center items-center gap-2"
              >
                <span>حفظ العملية</span>
                <Save className="w-5 h-5" />
              </button>
            </form>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-bold">آخر العمليات</h3>
            <button className="text-primary text-sm font-semibold hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-tertiary bg-surface-container-lowest rounded-2xl">
                لا توجد مصروفات مسجلة حتى الآن.
              </div>
            ) : (
              <AnimatePresence>
                {expenses.map((expense) => (
                  <motion.div 
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white border border-transparent hover:border-outline-variant/10 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(expense.category)}`}>
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{expense.notes || expense.category}</p>
                        <p className="text-xs text-tertiary">{expense.date} • {expense.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-error">{expense.amount.toLocaleString()}-</p>
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="text-outline-variant hover:text-error transition-colors p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
