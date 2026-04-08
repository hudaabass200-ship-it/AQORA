import React, { useState } from "react";
import { motion } from "motion/react";
import { Wallet, Plus, Trash2, TrendingUp, Receipt } from "lucide-react";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  notes: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", date: new Date().toISOString().split('T')[0], category: "علف", amount: 1500, notes: "شكاير علف 30% بروتين" },
    { id: "2", date: new Date().toISOString().split('T')[0], category: "زريعة", amount: 3000, notes: "زريعة بلطي وحيد الجنس" },
  ]);

  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("علف");
  const [notes, setNotes] = useState("");

  const categories = ["علف", "زريعة", "كهرباء", "عمالة", "أدوية/فيتامينات", "أخرى"];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

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
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">سجل المصروفات</h2>
        <p className="text-slate-600">تتبع تكاليف الدورة الإنتاجية لضمان إدارة مالية ناجحة لمشروعك.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Expense Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Plus className="w-5 h-5 ml-2 text-blue-600" />
            إضافة مصروف جديد
          </h3>
          
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المبلغ (جنيه)</label>
              <input
                type="number"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">البند</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات (اختياري)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="تفاصيل المصروف..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-4"
            >
              حفظ المصروف
            </button>
          </form>
        </motion.div>

        {/* Expenses List & Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-sm text-white flex items-center justify-between"
          >
            <div>
              <p className="text-emerald-100 font-medium mb-1">إجمالي المصروفات</p>
              <h3 className="text-4xl font-bold">{totalExpenses.toLocaleString()} <span className="text-xl font-normal">ج.م</span></h3>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Receipt className="w-5 h-5 ml-2 text-slate-500" />
                سجل العمليات
              </h3>
            </div>
            
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                لا توجد مصروفات مسجلة حتى الآن.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {expenses.map((expense) => (
                  <div key={expense.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{expense.category}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <span>{expense.date}</span>
                          {expense.notes && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[150px] md:max-w-xs">{expense.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-800 text-lg">
                        {expense.amount.toLocaleString()} ج.م
                      </span>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
