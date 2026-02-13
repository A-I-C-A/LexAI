import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from 'lucide-react';
import { callGroqAPI } from '../utils/groqHelper';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your LegalAxis AI assistant powered by Groq Llama. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    setIsTyping(true);
    
    try {
      const prompt = `You are LegalAxis AI, an advanced legal intelligence assistant. Provide helpful, accurate legal information while reminding users you are not a substitute for professional legal advice. Be concise but thorough in your responses.
      
Current conversation context:
${messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

User's question: ${currentInput}`;

      const aiResponse = await callGroqAPI(prompt, { maxTokens: 2048 });
      
      const botMsg = { sender: "bot", text: aiResponse };
      setMessages((msgs) => [...msgs, botMsg]);
      }

    } catch (err) {
      console.error("Groq API Error:", err);
      setMessages((msgs) => [...msgs, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting to the AI service. Please try again later." 
      }]);
    }
    setLoading(false);
    setIsTyping(false);
  };

  const quickActions = ["Contract Review", "Legal Advice", "Case Research", "Document Analysis"];

  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground p-4 sm:p-6">
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-dark-primary/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-dark-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">LegalAxis AI</h1>
              <p className="text-sm text-dark-muted-foreground font-light">Advanced Legal Intelligence</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className={`max-w-[80%] ${msg.sender === "user" ? "order-1" : "order-2"}`}>
                  <div className={`rounded-2xl p-4 ${
                    msg.sender === "user"
                      ? "bg-dark-primary text-dark-background ml-4"
                      : "bg-[#0E0E0E] backdrop-blur-xl border border-white/10 text-dark-foreground mr-4"
                  }`}>
                    <p className="text-sm font-light leading-relaxed">{msg.text}</p>
                  </div>
                </div>
                
                <div className={`flex items-end ${msg.sender === "user" ? "order-2 ml-3" : "order-1 mr-3"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.sender === "user" 
                      ? "bg-dark-primary/20"
                      : "bg-dark-primary/20"
                  }`}>
                    {msg.sender === "user" ? (
                      <span className="text-xs font-medium text-dark-primary">U</span>
                    ) : (
                      <Sparkles className="w-4 h-4 text-dark-primary" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-[#0E0E0E] backdrop-blur-xl border border-white/10 rounded-2xl p-4 mr-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-dark-primary animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-dark-primary animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-dark-primary animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-6 border-t border-white/10">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-[#0E0E0E] border border-white/20 text-xs font-light text-dark-foreground hover:bg-[#0E0E0E] hover:border-gray-300 transition-all duration-300"
                  onClick={() => setInput(action)}
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-6 py-4 rounded-2xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 text-dark-foreground placeholder-dark-muted-foreground focus:ring-2 focus:ring-dark-primary/40 focus:border-transparent transition-all duration-300 font-light"
                placeholder="Ask me anything about legal matters..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-2xl bg-dark-primary text-dark-background font-medium hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dark-background/30 border-t-dark-background rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


