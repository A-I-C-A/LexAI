import { motion } from 'framer-motion';
import { useState, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { callGroqAPI } from '../utils/groqHelper';
import { useTheme } from '../context/ThemeContext';

const VoiceAssistant = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your LegalAxis Voice Assistant. Tap the mic and ask me anything!" },
  ]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const recognitionRef = useRef(null);

  async function callGroqAI(userInput) {
    return await callGroqAPI(userInput, { maxTokens: 512 });
  }

  function speak(text) {
    if (window.speechSynthesis) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.rate = 1.05;
      window.speechSynthesis.speak(utter);
    }
  }

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
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
      try {
        const botReply = await callGroqAI(transcript);
        setMessages((msgs) => [...msgs, { sender: "bot", text: botReply }]);
        speak(botReply);
      } catch (err) {
        console.error("Error calling Groq API:", err);
        setMessages((msgs) => [...msgs, { sender: "bot", text: "Sorry, something went wrong. Please try again." }]);
      }
      setLoading(false);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    setRecording(true);
    recognition.start();
  };

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-dashboard-accent/20 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-dashboard-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">Voice Assistant</h1>
              <p className="text-sm text-muted-foreground font-light">Hands-Free Legal Intelligence</p>
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
                      : "bg-card backdrop-blur-xl border border-border text-foreground mr-4"
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

            {loading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-4 mr-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-dashboard-accent animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-dashboard-accent animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-dashboard-accent animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Voice Control Area */}
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
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
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
              {recording ? 'Tap to stop recording' : 'Tap to start speaking'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;


