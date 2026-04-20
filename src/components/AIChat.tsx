import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getAIClient, FISH_FARMING_SYSTEM_INSTRUCTION, FISH_FARMING_TOOLS } from "../lib/ai";
import { getEgyptAquacultureProduction, getFishSpeciesInfo, getFishTaxonomy } from "../lib/api-tools";

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
      content: "أهلاً بك! أنا Aqora AI، مستشارك العلمي المتخصص في الاستزراع السمكي. أنا هنا لأقدم لك أدق المعلومات المبنية على معايير FAO و FishBase لمساعدتك في نجاح مشروعك. كيف يمكنني مساعدتك اليوم؟"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !imageFile) || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add user message to UI
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: userMsg + (imageFile ? "\n[صورة مرفقة]" : "") 
    };
    setMessages((prev) => [...prev, newUserMsg]);
    
    const ai = getAIClient();

    if (!ai) {
      setMessages((prev) => [...prev, { 
        id: Date.now().toString(), 
        role: "model", 
        content: "⚠️ عذراً، مفتاح الذكاء الاصطناعي (API Key) غير متوفر. يرجى إضافته من صفحة الإعدادات لكي أتمكن من مساعدتك." 
      }]);
      return;
    }

    setIsLoading(true);

    try {
      // Format history for Gemini
      let currentHistory: any[] = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const userParts: any[] = [];
      if (userMsg) userParts.push({ text: userMsg });
      if (!userMsg && imageFile) userParts.push({ text: "ما رأيك في هذه الصورة؟" });
      
      if (imageFile && imagePreview) {
        const base64Data = imagePreview.split(',')[1];
        userParts.push({
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type
          }
        });
      }
      
      currentHistory.push({ role: "user", parts: userParts });
      
      // Clear image after sending
      clearImage();

      let response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: currentHistory,
        config: {
          systemInstruction: FISH_FARMING_SYSTEM_INSTRUCTION,
          tools: FISH_FARMING_TOOLS
        }
      });

      let callCount = 0;
      while (response.functionCalls && response.functionCalls.length > 0 && callCount < 3) {
        callCount++;
        const call = response.functionCalls[0];
        let apiResult: any = {};

        if (call.name === "getEgyptAquacultureProduction" || call.name === "get_egypt_aquaculture_production") {
          apiResult = await getEgyptAquacultureProduction();
        } else if (call.name === "getFishSpeciesInfo" || call.name === "get_fish_species_info") {
          const args = call.args as any;
          apiResult = await getFishSpeciesInfo(args.speciesName || "");
        } else if (call.name === "getFishTaxonomy") {
          const args = call.args as any;
          apiResult = await getFishTaxonomy(args.speciesName || "");
        }

        currentHistory.push({
          role: "model",
          parts: [{ functionCall: call }]
        });

        currentHistory.push({
          role: "user",
          parts: [{
            functionResponse: {
              name: call.name,
              response: apiResult
            }
          }]
        });

        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: currentHistory,
          config: {
            systemInstruction: FISH_FARMING_SYSTEM_INSTRUCTION,
            tools: FISH_FARMING_TOOLS
          }
        });
      }

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
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-surface rounded-3xl shadow-sm border border-outline-variant/15 overflow-hidden">
      <div className="bg-surface/70 backdrop-blur-md p-4 flex items-center border-b border-outline-variant/15 z-10">
        <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center ml-3">
          <Bot className="w-6 h-6 text-on-primary-container" />
        </div>
        <div>
          <h2 className="font-headline font-bold text-lg text-on-surface">المستشار الذكي</h2>
          <p className="text-tertiary text-sm">مدعوم بتقنية Gemini AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-background">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary mr-3" : "bg-surface-container-highest ml-3"}`}>
                  {msg.role === "user" ? <User className="w-5 h-5 text-on-primary" /> : <Bot className="w-5 h-5 text-tertiary" />}
                </div>
                <div
                  className={`p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-on-primary rounded-[1.5rem] rounded-br-sm"
                      : "bg-surface-container-high text-on-surface rounded-[1.5rem] rounded-tr-sm border-r-4 border-tertiary-fixed"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed font-body text-sm md:text-base">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex max-w-[85%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-highest ml-3 flex items-center justify-center">
                <Bot className="w-5 h-5 text-tertiary" />
              </div>
              <div className="p-4 rounded-[1.5rem] rounded-tr-sm bg-surface-container-high text-on-surface border-r-4 border-tertiary-fixed flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-tertiary text-sm font-body">جاري التفكير...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-surface-container-low border-t border-outline-variant/15">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-outline-variant/30">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-1 hover:opacity-90 transition-opacity shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <label className="flex-shrink-0 bg-surface-container-highest hover:bg-surface-dim text-tertiary p-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isLoading} />
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="اسأل عن التغذية، الأمراض، أو جودة المياه..."
            className="flex-1 bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none transition-all font-body text-on-surface placeholder:text-outline-variant"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !imageFile) || isLoading}
            className="liquid-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all flex items-center justify-center shadow-md"
          >
            <Send className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
