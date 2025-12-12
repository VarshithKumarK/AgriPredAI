import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaPaperPlane, FaUser, FaLeaf, FaSeedling } from "react-icons/fa";

const OllamaChat = () => {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            sender: "bot", 
            text: "🌱 Hello! I'm your Agri-Assistant. I can help you with crop diseases, farming tips, or plant care. What's on your mind today?" 
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            
            if (res.ok) {
                const botMsg = { id: Date.now() + 1, sender: "bot", text: data.response };
                setMessages((prev) => [...prev, botMsg]);
            } else {
                const errorMsg = { id: Date.now() + 1, sender: "bot", text: "⚠️ Sorry, I encountered an error connecting to the AI. Please ensure Ollama is running." };
                setMessages((prev) => [...prev, errorMsg]);
            }
        } catch (error) {
            console.error(error);
            const errorMsg = { id: Date.now() + 1, sender: "bot", text: "🌐 Network error. Please check your connection." };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-screen w-full bg-[#0a0f0d] flex flex-col pt-24 pb-6 px-4 md:px-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex-1 bg-white/5 backdrop-blur-xl border border-lime-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10">
                
                {/* Header */}
                <div className="bg-gray-900/80 p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-lime-400 to-green-600 rounded-2xl shadow-lg shadow-lime-500/20">
                            <FaRobot className="w-6 h-6 text-gray-900" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-wide">Agri-Assistant</h2>
                            <p className="text-sm text-lime-400 opacity-90 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                Online • Llama 3.2
                            </p>
                        </div>
                    </div>
                    {/* Optional: Add a clear chat button or minimal menu here */}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-4`}
                            >
                                {msg.sender === "bot" && (
                                    <div className="p-2 bg-gray-800 rounded-full border border-gray-700 flex-shrink-0 mt-1">
                                        <FaSeedling className="w-5 h-5 text-lime-400" />
                                    </div>
                                )}
                                
                                <div className={`relative max-w-[85%] md:max-w-[70%] p-5 shadow-xl leading-relaxed whitespace-pre-wrap text-[1.05rem] ${
                                    msg.sender === "user" 
                                    ? "bg-gradient-to-br from-lime-600 to-green-700 text-white rounded-2xl rounded-tr-none border border-lime-500/30" 
                                    : "bg-gray-800/80 text-gray-100 rounded-2xl rounded-tl-none border border-gray-700 backdrop-blur-md"
                                }`}>
                                    {msg.text}
                                </div>

                                {msg.sender === "user" && (
                                    <div className="p-2 bg-lime-600/20 rounded-full border border-lime-500/30 flex-shrink-0 mt-1">
                                        <FaUser className="w-5 h-5 text-lime-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {loading && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="flex justify-start items-center gap-4"
                        >
                            <div className="p-2 bg-gray-800 rounded-full border border-gray-700 flex-shrink-0">
                                <FaSeedling className="w-5 h-5 text-lime-400" />
                            </div>
                            <div className="bg-gray-800/50 text-lime-400 px-6 py-4 rounded-3xl rounded-tl-none border border-gray-700/50 flex items-center gap-1.5 shadow-lg">
                                <span className="text-sm font-semibold tracking-wider mr-2">Thinking</span>
                                <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-gray-900/80 border-t border-gray-800 backdrop-blur-md">
                    <div className="flex items-center gap-3 bg-gray-950 p-2 rounded-2xl border border-gray-800 focus-within:border-lime-500 focus-within:ring-2 focus-within:ring-lime-500/20 transition-all duration-300 shadow-inner">
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent text-white px-4 py-3 outline-none placeholder-gray-500 text-lg"
                            placeholder="Ask about your crops, pests, or harvest..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-white p-3.5 rounded-xl transition-all shadow-lg hover:shadow-lime-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <FaPaperPlane className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center mt-3 text-xs text-gray-500 font-medium tracking-wide">
                        AI can make mistakes. Verify important agricultural advice.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OllamaChat;
