import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Clock, Star, ExternalLink } from 'lucide-react';
import { Conversation, Language } from '../types';
import { languages } from '../lib/translation';

const ConversationLogs: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | 'all'>('all');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, [dateRange, selectedLanguage, selectedRating]);

  const loadConversations = async () => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        session_id: 'session_1',
        messages: [
          {
            id: '1',
            content: 'What are the admission requirements?',
            isBot: false,
            timestamp: new Date('2025-01-07T10:30:00'),
            language: 'en'
          },
          {
            id: '2',
            content: 'For undergraduate programs, you need to have completed 12th grade with a minimum of 75% marks. You also need to clear our entrance examination.',
            isBot: true,
            timestamp: new Date('2025-01-07T10:30:05'),
            language: 'en'
          }
        ],
        language: 'en',
        user_satisfaction: 5,
        created_at: '2025-01-07T10:30:00',
        updated_at: '2025-01-07T10:35:00'
      },
      {
        id: '2',
        session_id: 'session_2',
        messages: [
          {
            id: '3',
            content: 'फीस कितनी है?',
            isBot: false,
            timestamp: new Date('2025-01-07T11:15:00'),
            language: 'hi'
          },
          {
            id: '4',
            content: 'स्नातक कार्यक्रमों के लिए वार्षिक शुल्क 50,000 रुपये है। छात्रवृत्ति भी उपलब्ध है।',
            isBot: true,
            timestamp: new Date('2025-01-07T11:15:03'),
            language: 'hi'
          }
        ],
        language: 'hi',
        user_satisfaction: 4,
        created_at: '2025-01-07T11:15:00',
        updated_at: '2025-01-07T11:20:00'
      }
    ];
    setConversations(mockConversations);
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.messages.some(message =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesLanguage = selectedLanguage === 'all' || conversation.language === selectedLanguage;
    const matchesRating = selectedRating === 'all' || conversation.user_satisfaction === selectedRating;
    
    return matchesSearch && matchesLanguage && matchesRating;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getConversationDuration = (conversation: Conversation) => {
    const start = new Date(conversation.created_at);
    const end = new Date(conversation.updated_at);
    const duration = (end.getTime() - start.getTime()) / 1000 / 60; // in minutes
    return `${duration.toFixed(1)} min`;
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Conversation Logs</h2>
        <div className="text-sm text-gray-600">
          {filteredConversations.length} conversations found
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Languages</option>
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'today' | 'week' | 'month' | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conversation List */}
      <div className="space-y-4">
        {filteredConversations.map((conversation) => (
          <div key={conversation.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      Session {conversation.session_id.split('_')[1]}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {languages[conversation.language]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimestamp(conversation.created_at)}</span>
                    </div>
                    <span>Duration: {getConversationDuration(conversation)}</span>
                    <span>{conversation.messages.length} messages</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {renderStars(conversation.user_satisfaction)}
                <button
                  onClick={() => setSelectedConversation(
                    selectedConversation === conversation.id ? null : conversation.id
                  )}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">View Details</span>
                </button>
              </div>
            </div>

            {/* Conversation Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">User:</span>{' '}
                  <span className="text-gray-800">{conversation.messages[0]?.content}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Assistant:</span>{' '}
                  <span className="text-gray-800">
                    {conversation.messages[1]?.content.substring(0, 150)}
                    {conversation.messages[1]?.content.length > 150 ? '...' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Conversation */}
            {selectedConversation === conversation.id && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Full Conversation</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isBot
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredConversations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No conversations found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination (if needed for large datasets) */}
      <div className="flex items-center justify-center space-x-2">
        <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">Page 1 of 1</span>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          Next
        </button>
      </div>
    </div>
  );
};

export default ConversationLogs;