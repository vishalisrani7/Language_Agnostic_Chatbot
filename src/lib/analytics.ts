import { supabase } from './supabase';
import { Message, Language } from '../types';

export const logConversation = async (
  sessionId: string,
  messages: Message[],
  language: Language,
  userSatisfaction?: number
): Promise<void> => {
  try {
 
    console.log('Logging conversation:', {
      session_id: sessionId,
      messages,
      language,
      user_satisfaction: userSatisfaction
    });

  } catch (error) {
    console.error('Error logging conversation:', error);
  }
};

export const getAnalytics = async (timeRange: '7d' | '30d' | '90d') => {
  try {
    return {
      totalConversations: 1247,
      averageResponseTime: 1.8,
      userSatisfactionAverage: 4.2,
      languageDistribution: {
        en: 45.6,
        hi: 31.2,
        mr: 15.6,
        gu: 7.6
      },
      popularQueries: [
        'Admission requirements',
        'Fee structure',
        'Hostel facilities',
        'Exam schedule',
        'Library timings'
      ]
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

export const updateUserSatisfaction = async (sessionId: string, rating: number): Promise<void> => {
  try {
    console.log('Updating satisfaction rating:', { sessionId, rating });

  } catch (error) {
    console.error('Error updating satisfaction:', error);
  }
};