import { motion } from 'framer-motion';
import { useState, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';

const VoiceAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your LegalAxis Voice Assistant. Tap the mic and ask me anything!" },
  ]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const recognitionRef = useRef(null);

  async function callGeminiApi(userInput) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("API key not found");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userInput }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
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
        const botReply = await callGeminiApi(transcript);
        setMessages((msgs) => [...msgs, { sender: "bot", text: botReply }]);
        speak(botReply);
      } catch (err) {
        console.error("Error calling Gemini API:", err);
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
              <Volume2 className="w-6 h-6 text-dark-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">Voice Assistant</h1>
              <p className="text-sm text-dark-muted-foreground font-light">Hands-Free Legal Intelligence</p>
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

            {loading && (
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
          </div>
          
          {/* Voice Control Area */}
          <div className="p-8 border-t border-white/10 flex flex-col items-center justify-center space-y-6">
            {recording && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-dark-primary font-light mb-2">Listening...</p>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-8 bg-dark-primary rounded-full animate-pulse"
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
                  : 'bg-dark-primary hover:bg-dark-primary/90 hover:scale-110'
              }`}
            >
              {recording ? (
                <MicOff className="w-10 h-10 text-dark-background" />
              ) : (
                <Mic className="w-10 h-10 text-dark-background" />
              )}
            </button>

            <p className="text-sm text-dark-muted-foreground font-light">
              {recording ? 'Tap to stop recording' : 'Tap to start speaking'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;


