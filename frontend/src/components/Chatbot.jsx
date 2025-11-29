import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from "../redux/constants"; // Ensure BASE_URL is imported correctly

const Chatbot = ({ isOpen, toggleChatbot }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'bot', text: "Hello! I'm your AI movie assistant. Ask me anything about movies!" }]);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // API Call to Backend
            const res = await fetch(`${BASE_URL}/api/v1/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();

            if (res.ok) {
                const botMessage = { sender: 'bot', text: data.reply };
                setMessages((prev) => [...prev, botMessage]);
            } else {
                setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble thinking right now." }]);
            }

        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { sender: 'bot', text: "Network error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-96 bg-gray-900 rounded-lg shadow-2xl flex flex-col border border-gray-700 z-50">
                    {/* Header */}
                    <div className="flex justify-between items-center p-3 bg-teal-600 border-b border-gray-700 rounded-t-lg">
                        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                             ✨ Cineview AI
                        </h3>
                        <button onClick={toggleChatbot} className="text-white hover:text-gray-200 text-xl font-bold">
                            &times;
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-3 overflow-y-auto custom-scrollbar bg-gray-800">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                                    msg.sender === 'user' 
                                    ? 'bg-teal-600 text-white rounded-br-none' 
                                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="bg-gray-700 p-2 rounded-lg rounded-bl-none">
                                    <span className="animate-pulse text-gray-400 text-xs">AI is typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                            placeholder="Ask about movies..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading}
                            className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;