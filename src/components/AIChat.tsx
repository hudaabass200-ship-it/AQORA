import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: "أهلاً بك يا صديقي المربي! أنا مستشارك الذكي للاستزراع السمكي. اسألني أي شيء عن تربية البلطي، القاروص، أو الدنيس في مصر، أو عن كيفية إدارة جودة المياه."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: userMsg }]);
    
    if (!ai) {
      setMessages((prev) => [...prev, { 
        id: Date.now().toString(), 
        role: "model", 
        content: "⚠️ عذراً، مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) غير متوفر. لحل هذه المشكلة:\n1. اذهب إلى إعدادات مشروعك في Vercel.\n2. ادخل إلى قسم Environment Variables.\n3. أضف متغير باسم `GEMINI_API_KEY` وضع فيه مفتاحك.\n4. قم بعمل Redeploy للمشروع." 
      }]);
      return;
    }

    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: "أنت خبير زراعي مصري متخصص في الاستزراع السمكي (خاصة البلطي، القاروص، والدنيس). تجيب على أسئلة المربين الصغار بأسلوب مبسط، عملي، ومناسب للبيئة المصرية. إجاباتك يجب أن تكون دقيقة ومباشرة." },
              { text: userMsg }
            ]
          }
        ],
      });

      const reply = response.text || "عذراً، حدث خطأ في معالجة طلبك.";
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "model", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "model", content: "عذراً، حدث خطأ في الاتصال بالمستشار. يرجى المحاولة مرة أخرى." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-800 p-4 flex items-center text-white">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center ml-3">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg">المستشار الذكي</h2>
          <p className="text-slate-300 text-sm">مدعوم بتقنية Gemini AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600 mr-3" : "bg-slate-800 ml-3"}`}>
                  {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div
                  className={`p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tl-none"
                      : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tr-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex max-w-[85%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 ml-3 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tr-none flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-slate-500">جاري التفكير...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="اسأل عن التغذية، الأمراض، أو جودة المياه..."
            className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
