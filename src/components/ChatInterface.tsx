import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Globe, Mic, MicOff, Volume2 } from 'lucide-react';
import { generateResponse } from '../lib/chatbot';
import { logConversation } from '../lib/analytics';
import { languages, translateText } from '../lib/translation';
import { Message, Language } from '../types';
import ChatMessage from './ChatMessage';
import LanguageSelector from './LanguageSelector';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [sessionId, setSessionId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSessionId(Date.now().toString());
    
    const welcomeMessage: Message = {
      id: '1',
      content: getWelcomeMessage(currentLanguage),
      isBot: true,
      timestamp: new Date(),
      language: currentLanguage
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = (lang: Language): string => {
    const welcomes = {
      en: "Hello! I'm your campus assistant. How can I help you today?",
      hi: "नमस्ते! मैं आपका कैंपस सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      mr: "नमस्कार! मी तुमचा कॅम्पस सहाय्यक आहे। आज मी तुम्हाला कशी मदत करू शकतो?",
      gu: "નમસ્તે! હું તમારો કેમ્પસ સહાયક છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?",
      ta: "வணக்கம்! நான் உங்கள் கேம்பஸ் உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?"
    };
    return welcomes[lang] || welcomes.en;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateResponse(input, currentLanguage, messages);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isBot: true,
        timestamp: new Date(),
        language: currentLanguage,
        suggestions: response.suggestions,
        needsHumanHelp: response.needsHumanHelp
      };

      setMessages(prev => [...prev, botMessage]);

      await logConversation(sessionId, [...messages, userMessage, botMessage], currentLanguage);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble right now. Please try again or contact our office directly.",
        isBot: true,
        timestamp: new Date(),
        language: currentLanguage,
        needsHumanHelp: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = currentLanguage === 'en' ? 'en-US' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'en' ? 'en-US' : 'hi-IN';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Campus Assistant</h1>
              <p className="text-sm text-gray-600">Multilingual Support Available</p>
            </div>
          </div>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onSpeak={speak}
              currentLanguage={currentLanguage}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentLanguage === 'hi' ? 'यहाँ अपना प्रश्न टाइप करें...' :
                  currentLanguage === 'mr' ? 'तुमचा प्रश्न येथे टाइप करा...' :
                  'Type your question here...'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            
            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;