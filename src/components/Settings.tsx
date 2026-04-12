import { useState, useEffect } from "react";
import { Key, Save, CheckCircle, ShieldAlert } from "lucide-react";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("custom_gemini_api_key");
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("custom_gemini_api_key", apiKey.trim());
    } else {
      localStorage.removeItem("custom_gemini_api_key");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Key className="w-6 h-6 text-slate-600" />
          إعدادات مفتاح الذكاء الاصطناعي (API Key)
        </h2>
        <p className="text-slate-600">
          يمكنك إضافة مفتاح Gemini API الخاص بك هنا لضمان دقة ومصداقية المعلومات، ولتجنب أي قيود على الاستخدام.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="space-y-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
            <ShieldAlert className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <div className="text-sm leading-relaxed">
              <strong>ملاحظة هامة:</strong> المفتاح الذي تقوم بإدخاله هنا يتم حفظه في متصفحك فقط (Local Storage) ولا يتم إرساله إلى أي خوادم خارجية سوى خوادم Google للحصول على الإجابات. إذا تركت الحقل فارغاً، سيستخدم التطبيق المفتاح الافتراضي.
            </div>
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-bold text-slate-700 mb-2">
              مفتاح Gemini API الخاص بك
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
              dir="ltr"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ الإعدادات
            </button>

            {saved && (
              <span className="text-emerald-600 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <CheckCircle className="w-5 h-5" />
                تم الحفظ بنجاح!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
