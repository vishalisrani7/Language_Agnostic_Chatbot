export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  language: Language;
  suggestions?: string[];
  needsHumanHelp?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  language: Language;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  session_id: string;
  messages: Message[];
  language: Language;
  user_satisfaction: number | null;
  created_at: string;
  updated_at: string;
}

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'volunteer';
  created_at: string;
}

export interface Analytics {
  totalConversations: number;
  totalFAQs: number;
  averageResolution: number;
  userSatisfaction: number;
  languageDistribution: { language: string; count: number; percentage: number }[];
  popularQueries: { query: string; count: number; category: string }[];
  conversationTrends: { date: string; conversations: number }[];
}