export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta';

export const languages: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  ta: 'தமிழ்'
};

export const translateText = async (text: string, from: Language, to: Language): Promise<string> => {
 
  return text;
};

export const detectLanguage = (text: string): Language => {
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi'; 
  }
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return 'gu'; 
  }
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta';
  }
  return 'en'; 
};

export const getLanguageDirection = (language: Language): 'ltr' | 'rtl' => {

  return 'ltr';
};