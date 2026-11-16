import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Search,
  MapPin,
  Cpu,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { pickLocalized } from '../utils/i18n';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  groundingSources?: Array<{
    title: string;
    uri: string;
    type: 'web' | 'maps';
  }>;
  modelUsed?: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  onOpenBooking?: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ onOpenBooking }) => {
  const { language, t } = useLanguage();
  const tx = <T,>(en: T, ps: T, fa: T) => pickLocalized(language, { en, ps, fa });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps' | 'none'>('search');
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: t.chatbot.welcomeMsg,
      timestamp: tx('Just now', 'اوس', 'هم‌اکنون'),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Optional geolocation for Google Maps grounding
      let userLocation: { latitude: number; longitude: number } | undefined;
      if (groundingMode === 'maps' && navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          });
          userLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
        } catch {
          // Fallback to clinic default location in Kabul
          userLocation = { latitude: 34.5553, longitude: 69.2075 };
        }
      }

      // Convert conversation history for server-side Gemini endpoint
      const payloadMessages = newMessages
        .filter((m) => m.id !== 'welcome-1')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          model: selectedModel,
          grounding: groundingMode,
          userLocation,
        }),
      });

      if (!res.ok) {
        throw new Error('Clinical AI service temporarily busy.');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        groundingSources: data.groundingSources,
        modelUsed: data.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat generation error:', err);
      setError(
        tx(
          'Could not reach the clinical assistant. Please check your connection or contact our clinic desk at +93 780 299 299.',
          'کلینیکي مرستیال ته لاسرسی ونه شو. مهرباني وکړئ له +93 780 299 299 سره اړیکه ونیسئ.',
          'دسترسی به دستیار کلینیکی ممکن نشد. لطفاً با شماره +93 780 299 299 تماس بگیرید.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-1',
        role: 'assistant',
        content: t.chatbot.welcomeMsg,
        timestamp: tx('Just now', 'اوس', 'هم‌اکنون'),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-20 end-4 sm:bottom-8 sm:end-8 z-40 min-h-[48px] px-4 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B08A24] text-[#06110C] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer border border-[#E2C36B]/60"
          aria-label={t.chatbot.askButton}
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-xs tracking-wider uppercase hidden sm:inline">
            {t.chatbot.askButton}
          </span>
        </button>
      )}

      {/* Main Chat Interface Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl border border-[#D4AF37]/40 bg-[#06110C] text-[#F4F0E6] rounded-3xl overflow-hidden flex flex-col ${
            isMinimized
              ? 'bottom-20 end-4 sm:bottom-8 sm:end-8 w-80 h-16'
              : 'bottom-4 end-4 sm:bottom-8 sm:end-8 w-[92vw] sm:w-[440px] md:w-[480px] h-[82vh] max-h-[700px]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#0B1D14] to-[#06110C] border-b border-[#1D3B2C] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6]">
                  {t.chatbot.title}
                </h3>
                <p className="text-[11px] text-[#A6B8AE]">
                  {t.chatbot.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-[#8da396] hover:text-[#f5f3ec] hover:bg-[#0e2118] transition-colors cursor-pointer"
                title={isMinimized ? tx('Expand Chat', 'پراخول', 'بزرگ کردن') : tx('Minimize Chat', 'کم کول', 'کوچک کردن')}
                aria-label={isMinimized ? tx('Expand Chat', 'پراخول', 'بزرگ کردن') : tx('Minimize Chat', 'کم کول', 'کوچک کردن')}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#8da396] hover:text-[#f5f3ec] hover:bg-[#0e2118] transition-colors cursor-pointer"
                title={t.about.closeBtn}
                aria-label={t.about.closeBtn}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Model & Grounding Controls Bar */}
              <div className="px-4 py-2.5 bg-[#05130b] border-b border-[#1b3b2f] flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Model Selector */}
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#d4af37]" />
                  <select
                    dir="ltr"
                    value={selectedModel}
                    onChange={(e: any) => setSelectedModel(e.target.value)}
                    aria-label="Model"
                    className="bg-[#0a1e14] border border-[#1b3b2f] text-[11px] text-[#f5f3ec] rounded-lg px-2 py-1 focus:border-[#d4af37] focus:outline-none cursor-pointer"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash</option>
                    <option value="gemini-4-argon">gemini-4-argon</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                  </select>
                </div>

                {/* Grounding Selector */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setGroundingMode(groundingMode === 'search' ? 'none' : 'search')}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                      groundingMode === 'search'
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                        : 'bg-[#0a1e14] border-[#1b3b2f] text-[#8da396] hover:text-[#f5f3ec]'
                    }`}
                  >
                    <Search className="w-3 h-3" />
                    <span>{t.chatbot.searchBtn}</span>
                  </button>

                  <button
                    onClick={() => setGroundingMode(groundingMode === 'maps' ? 'none' : 'maps')}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                      groundingMode === 'maps'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-[#0a1e14] border-[#1b3b2f] text-[#8da396] hover:text-[#f5f3ec]'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{t.chatbot.mapsBtn}</span>
                  </button>

                  <button
                    onClick={handleClearHistory}
                    className="p-1 rounded-md text-[#8da396] hover:text-[#f5f3ec] hover:bg-[#0e2118] transition-colors ms-1 cursor-pointer"
                    title={tx('Reset Conversation', 'بیا پیل کول', 'شروع مجدد گفتگو')}
                    aria-label={tx('Reset Conversation', 'بیا پیل کول', 'شروع مجدد گفتگو')}
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Scrollable Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-[#d4af37] text-black font-medium rounded-se-sm shadow-md'
                            : 'bg-[#0a1e14] border border-[#1b3b2f] text-[#f5f3ec] rounded-ss-sm shadow-sm'
                        }`}
                      >
                        <div className="whitespace-pre-line">
                          {m.id === 'welcome-1' ? t.chatbot.welcomeMsg : m.content}
                        </div>

                        {/* Grounding Citations */}
                        {m.groundingSources && m.groundingSources.length > 0 && (
                          <div className="pt-2 mt-2 border-t border-[#1b3b2f]/80 space-y-1.5">
                            <span className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider block">
                              Verified Grounding Citations:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {m.groundingSources.slice(0, 4).map((src, i) => (
                                <a
                                  key={i}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#06120d] border border-[#234b3c] hover:border-[#d4af37] text-[10px] text-[#a6b6ad] hover:text-[#d4af37] transition-colors truncate max-w-[200px]"
                                >
                                  {src.type === 'maps' ? (
                                    <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Search className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                                  )}
                                  <span className="truncate">{src.title}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div
                          className={`text-[9px] flex items-center justify-between pt-1 ${
                            isUser ? 'text-black/60' : 'text-[#6b8275]'
                          }`}
                        >
                          <span>{m.timestamp}</span>
                          {m.modelUsed && <span>{m.modelUsed}</span>}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-[#d4af37] text-black flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-3 justify-start items-center text-xs text-[#8da396]">
                    <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-3 rounded-2xl bg-[#0a1e14] border border-[#1b3b2f] flex items-center gap-2 text-xs text-[#a6b6ad]">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{t.chatbot.thinking}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Row */}
              <div className="px-4 py-2 border-t border-[#1b3b2f]/60 bg-[#05110a] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                {t.chatbot.quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(qp.prompt)}
                    className="px-2.5 py-1 rounded-full bg-[#0a1e14] border border-[#1b3b2f] hover:border-[#d4af37] text-[#a6b6ad] hover:text-[#d4af37] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 bg-[#071710] border-t border-[#1b3b2f] flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={t.chatbot.placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#05110a] border border-[#1b3b2f] focus:border-[#d4af37] text-xs sm:text-sm text-[#f5f3ec] placeholder:text-[#6b8275] focus:outline-none disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                  aria-label={t.chatbot.askButton}
                >
                  <Send className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
