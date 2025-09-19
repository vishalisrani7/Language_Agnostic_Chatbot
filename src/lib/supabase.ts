import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data.');
}

export const supabase = createClient(
  supabaseUrl || 'https://mock-url.supabase.co',
  supabaseAnonKey || 'mock-anon-key'
);

export type Database = {
  public: {
    Tables: {
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          language: string;
          keywords: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          question: string;
          answer: string;
          category: string;
          language: string;
          keywords?: string[];
        };
        Update: {
          question?: string;
          answer?: string;
          category?: string;
          language?: string;
          keywords?: string[];
        };
      };
      conversations: {
        Row: {
          id: string;
          session_id: string;
          messages: any[];
          language: string;
          user_satisfaction: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          session_id: string;
          messages: any[];
          language: string;
          user_satisfaction?: number | null;
        };
        Update: {
          messages?: any[];
          user_satisfaction?: number | null;
        };
      };
    };
  };
};