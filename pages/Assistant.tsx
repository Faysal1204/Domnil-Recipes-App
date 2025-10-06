
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import type { ChatMessage } from '../types';

const Assistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.askCookingAssistant(input);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'model', content: "Oops! Something went wrong. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-white rounded-xl shadow-lg">
        <header className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">AI Cooking Assistant</h1>
            <p className="text-sm text-gray-500">Ask me anything about cooking!</p>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">A</div>}
                    <div className={`max-w-md md:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                         <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }}/>
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">A</div>
                    <div className="max-w-md md:max-w-lg p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="e.g., How do I poach an egg?"
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    disabled={isLoading}
                />
                <button type="submit" className="bg-primary text-white rounded-full p-3 hover:bg-primary-dark transition-colors disabled:bg-gray-400" disabled={isLoading || !input.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
            </form>
        </div>
    </div>
  );
};

export default Assistant;
