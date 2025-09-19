import React from 'react';
import { MessageCircle, User, Volume2, ExternalLink } from 'lucide-react';
import { Message, Language } from '../types';

interface ChatMessageProps {
  message: Message;
  onSpeak: (text: string) => void;
  currentLanguage: Language;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSpeak, currentLanguage }) => {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-start space-x-3 ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
    
      <div className={`p-2 rounded-full ${message.isBot ? 'bg-blue-600' : 'bg-gray-600'}`}>
        {message.isBot ? (
          <MessageCircle className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={`max-w-md ${message.isBot ? '' : 'ml-auto'}`}>
        <div className={`p-3 rounded-lg shadow-sm border ${
          message.isBot 
            ? 'bg-white border-gray-200' 
            : 'bg-blue-600 text-white border-blue-600'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-gray-600">Suggested questions:</p>
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="block w-full text-left text-sm bg-gray-50 hover:bg-gray-100 p-2 rounded border border-gray-200 transition-colors"
                  onClick={() => {
                    const event = new CustomEvent('sendSuggestion', { detail: suggestion });
                    window.dispatchEvent(event);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {message.needsHumanHelp && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-orange-800">
                  {currentLanguage === 'hi' 
                    ? 'मानवीय सहायता की आवश्यकता? संपर्क करें: +91-7878528723 या help@college.edu'
                    : 'Need human assistance? Contact: +91-7878528723 or help@college.edu'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>{formatTimestamp(message.timestamp)}</span>
          {message.isBot && (
            <button
              onClick={() => onSpeak(message.content)}
              className="hover:text-blue-600 transition-colors"
              title="Read aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;