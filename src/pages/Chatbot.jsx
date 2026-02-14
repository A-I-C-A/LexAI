import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic, MicOff, MessageSquare, Volume2 } from 'lucide-react';
import { callGroqAPI } from '../utils/groqHelper';
import { useTheme } from '../context/ThemeContext';

const Chatbot = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState('text'); // 'text' or 'voice'
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Lex AI assistant powered by Groq Llama. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    if (window.speechSynthesis && mode === 'voice') {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.rate = 1.05;
      window.speechSynthesis.speak(utter);
    }
  };

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
      
      if (mode === 'voice') {
        speak(aiResponse);
      }

    } catch (err) {
      console.error("Groq API Error:", err);
      setMessages((msgs) => [...msgs, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting to the AI service. Please try again later." 
      }]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (recording) {
      recognitionRef.current.stop();
      setRecording(false);
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setMessages((msgs) => [...msgs, { sender: "user", text: transcript }]);
      setRecording(false);
      setLoading(true);
      setIsTyping(true);
      try {
        const prompt = `You are Lex AI, an advanced legal intelligence assistant. Provide helpful, accurate legal information while reminding users you are not a substitute for professional legal advice. Be concise but thorough in your responses.

Current conversation context:
${messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

User's question: ${transcript}`;

        const botReply = await callGroqAPI(prompt, { maxTokens: 2048 });
        setMessages((msgs) => [...msgs, { sender: "bot", text: botReply }]);
        speak(botReply);
      } catch (err) {
        console.error("Error calling Groq API:", err);
        setMessages((msgs) => [...msgs, { sender: "bot", text: "Sorry, something went wrong. Please try again." }]);
      }
      setLoading(false);
      setIsTyping(false);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    setRecording(true);
    recognition.start();
  };

  const quickActions = ["Contract Review", "Legal Advice", "Case Research", "Document Analysis"];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-dashboard-accent/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-dashboard-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-light tracking-tighter">Lex AI</h1>
                <p className="text-sm text-muted-foreground font-light">
                  {mode === 'text' ? 'Advanced Legal Intelligence' : 'Hands-Free Legal Intelligence'}
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-2xl p-1">
              <button
                onClick={() => setMode('text')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  mode === 'text' 
                    ? 'bg-dashboard-accent text-dashboard-accent-text' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </button>
              <button
                onClick={() => setMode('voice')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  mode === 'voice' 
                    ? 'bg-dashboard-accent text-dashboard-accent-text' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Voice</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 rounded-3xl bg-card backdrop-blur-xl border border-border overflow-hidden flex flex-col">
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
                      ? "bg-dashboard-accent text-dashboard-accent-text ml-4"
                      : "bg-muted backdrop-blur-xl border border-border text-foreground mr-4"
                  }`}>
                    <p className="text-sm font-light leading-relaxed">{msg.text}</p>
                  </div>
                </div>
                
                <div className={`flex items-end ${msg.sender === "user" ? "order-2 ml-3" : "order-1 mr-3"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.sender === "user" 
                      ? "bg-dashboard-accent/20"
                      : "bg-dashboard-accent/20"
                  }`}>
                    {msg.sender === "user" ? (
                      <span className="text-xs font-medium text-dashboard-accent">U</span>
                    ) : (
                      <Sparkles className="w-4 h-4 text-dashboard-accent" />
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
                <div className="bg-muted backdrop-blur-xl border border-border rounded-2xl p-4 mr-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-dashboard-accent animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-dashboard-accent animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-dashboard-accent animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Input Area - Changes based on mode */}
          {mode === 'text' ? (
            <div className="p-6 border-t border-border">
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className="flex-shrink-0 px-4 py-2 rounded-full bg-muted border border-border text-xs font-light text-foreground hover:bg-muted/80 hover:border-border/80 transition-all duration-300"
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
                  className="flex-1 px-6 py-4 rounded-2xl bg-muted backdrop-blur-xl border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-dashboard-accent/40 focus:border-transparent transition-all duration-300 font-light"
                  placeholder="Ask me anything about legal matters..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-2xl bg-dashboard-accent text-dashboard-accent-text font-medium hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-dashboard-accent-text/30 border-t-dashboard-accent-text rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 border-t border-border flex flex-col items-center justify-center space-y-6">
              {recording && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm text-dashboard-accent font-light mb-2">Listening...</p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-8 bg-dashboard-accent rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleMicClick}
                disabled={loading}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                  recording
                    ? 'bg-red-500 hover:bg-red-600 scale-110'
                    : 'bg-dashboard-accent hover:bg-dashboard-accent-hover hover:scale-110'
                }`}
              >
                {recording ? (
                  <MicOff className="w-10 h-10 text-background" />
                ) : (
                  <Mic className="w-10 h-10 text-dashboard-accent-text" />
                )}
              </button>

              <p className="text-sm text-muted-foreground font-light">
                {recording ? 'Tap to stop recording' : loading ? 'Processing...' : 'Tap to start speaking'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


