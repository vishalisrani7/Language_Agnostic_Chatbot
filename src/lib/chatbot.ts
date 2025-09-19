import { Message, Language } from '../types';
import { translateText } from './translation';

interface ChatResponse {
  content: string;
  suggestions?: string[];
  needsHumanHelp?: boolean;
}

const faqDatabase = [
  {
    keywords: ['admission', 'requirements', 'eligibility', 'प्रवेश', 'योग्यता'],
    question: 'What are the admission requirements?',
    answer: 'For undergraduate programs, you need to have completed 12th grade with a minimum of 75% marks. You also need to clear our entrance examination.',
    category: 'Admissions',
    languages: {
      hi: {
        question: 'प्रवेश की आवश्यकताएं क्या हैं?',
        answer: 'स्नातक कार्यक्रमों के लिए, आपको न्यूनतम 75% अंकों के साथ 12वीं कक्षा पूरी करनी होगी। आपको हमारी प्रवेश परीक्षा भी उत्तीर्ण करनी होगी।'
      }
    }
  },
  {
    keywords: ['fee', 'cost', 'fees', 'money', 'scholarship', 'फीस', 'शुल्क', 'छात्रवृत्ति'],
    question: 'What is the fee structure?',
    answer: 'The annual fee for undergraduate programs is ₹50,000. We also offer merit-based scholarships and financial aid for deserving students.',
    category: 'Fees & Scholarships',
    languages: {
      hi: {
        question: 'फीस कितनी है?',
        answer: 'स्नातक कार्यक्रमों के लिए वार्षिक शुल्क ₹50,000 है। हम योग्यता आधारित छात्रवृत्ति और योग्य छात्रों के लिए वित्तीय सहायता भी प्रदान करते हैं।'
      }
    }
  },
  {
    keywords: ['hostel', 'accommodation', 'room', 'stay', 'छात्रावास', 'कमरा'],
    question: 'What are the hostel facilities?',
    answer: 'We have separate hostels for boys and girls with 24/7 security, WiFi, mess facilities, recreation room, and study halls. AC and non-AC rooms are available.',
    category: 'Hostel',
    languages: {
      hi: {
        question: 'छात्रावास की सुविधाएं क्या हैं?',
        answer: 'हमारे पास लड़कों और लड़कियों के लिए अलग छात्रावास हैं जिनमें 24/7 सुरक्षा, WiFi, मेस सुविधाएं, मनोरंजन कक्ष और अध्ययन हॉल हैं। AC और non-AC कमरे उपलब्ध हैं।'
      }
    }
  },
  {
    keywords: ['exam', 'examination', 'test', 'schedule', 'परीक्षा', 'समय सारणी'],
    question: 'When are the examinations?',
    answer: 'Mid-term exams are in October and March. Final exams are in December and May. The detailed schedule is published 1 month in advance.',
    category: 'Examinations',
    languages: {
      hi: {
        question: 'परीक्षाएं कब होती हैं?',
        answer: 'मध्यावधि परीक्षाएं अक्टूबर और मार्च में होती हैं। फाइनल परीक्षाएं दिसंबर और मई में होती हैं। विस्तृत समय सारणी 1 महीने पहले प्रकाशित की जाती है।'
      }
    }
  },
  {
    keywords: ['library', 'books', 'study', 'timings', 'पुस्तकालय', 'किताबें'],
    question: 'What are the library timings and facilities?',
    answer: 'The library is open from 8 AM to 10 PM on weekdays and 9 AM to 6 PM on weekends. We have over 50,000 books, digital resources, and quiet study areas.',
    category: 'Library',
    languages: {
      hi: {
        question: 'पुस्तकालय का समय और सुविधाएं क्या हैं?',
        answer: 'पुस्तकालय सप्ताह के दिनों में सुबह 8 बजे से रात 10 बजे तक और सप्ताहांत में सुबह 9 बजे से शाम 6 बजे तक खुला रहता है। हमारे पास 50,000 से अधिक किताबें, डिजिटल संसाधन और शांत अध्ययन क्षेत्र हैं।'
      }
    }
  }
];

export const generateResponse = async (
  input: string, 
  language: Language, 
  conversationHistory: Message[]
): Promise<ChatResponse> => {
  const lowerInput = input.toLowerCase();
  
  const matchedFAQ = faqDatabase.find(faq => 
    faq.keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))
  );

  if (matchedFAQ) {
    const response = matchedFAQ.languages[language] || {
      answer: matchedFAQ.answer,
      question: matchedFAQ.question
    };

    const suggestions = getSuggestions(matchedFAQ.category, language);

    return {
      content: response.answer,
      suggestions,
      needsHumanHelp: false
    };
  }

  const contextResponse = handleContextualQuery(input, conversationHistory, language);
  if (contextResponse) {
    return contextResponse;
  }

  if (isGreeting(input)) {
    return {
      content: getGreetingResponse(language),
      suggestions: getGeneralSuggestions(language)
    };
  }

  return {
    content: getFallbackResponse(language),
    needsHumanHelp: true,
    suggestions: getGeneralSuggestions(language)
  };
};

const isGreeting = (input: string): boolean => {
  const greetings = ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'हैलो'];
  return greetings.some(greeting => input.toLowerCase().includes(greeting));
};

const getGreetingResponse = (language: Language): string => {
  const responses = {
    en: "Hello! I'm your campus assistant. I can help you with admissions, fees, hostel facilities, examinations, library information, and more. What would you like to know?",
    hi: "नमस्ते! मैं आपका कैंपस सहायक हूं। मैं प्रवेश, फीस, छात्रावास सुविधाएं, परीक्षा, पुस्तकालय जानकारी आदि में आपकी मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
    mr: "नमस्कार! मी तुमचा कॅम्पस सहाय्यक आहे। मी प्रवेश, फी, वसतिगृह सुविधा, परीक्षा, ग्रंथालय माहिती इत्यादीमध्ये तुम्हाला मदत करू शकतो. तुम्हाला काय जाणून घ्यायचे आहे?",
    gu: "નમસ્તે! હું તમારો કેમ્પસ સહાયક છું. હું પ્રવેશ, ફી, હોસ્ટેલ સુવિધાઓ, પરીક્ષા, પુસ્તકાલય માહિતી વગેરેમાં તમારી મદદ કરી શકું છું. તમે શું જાણવા માંગો છો?",
    ta: "வணக்கம்! நான் உங்கள் கேம்பஸ் உதவியாளர். நான் சேர்க்கை, கட்டணம், விடுதி வசதிகள், தேர்வுகள், நூலக தகவல் போன்றவற்றில் உங்களுக்கு உதவ முடியும். நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?"
  };
  return responses[language] || responses.en;
};

const getFallbackResponse = (language: Language): string => {
  const responses = {
    en: "I'm sorry, I don't have specific information about that. Our office staff can provide more detailed assistance. Would you like me to connect you with human support?",
    hi: "मुझे खुशी है, मेरे पास इसके बारे में विशिष्ट जानकारी नहीं है। हमारे कार्यालय स्टाफ अधिक विस्तृत सहायता प्रदान कर सकते हैं। क्या आप चाहते हैं कि मैं आपको मानवीय सहायता से जोड़ूं?",
    mr: "मला माफ करा, माझ्याकडे त्याबद्दल विशिष्ट माहिती नाही. आमचे कार्यालयीन कर्मचारी अधिक तपशीलवार मदत देऊ शकतात. तुम्हाला मी तुम्हाला मानवी समर्थनाशी जोडावे असे वाटते का?",
    gu: "માફ કરજો, મારી પાસે તે વિશે વિશિષ્ટ માહિતી નથી. અમારો ઓફિસ સ્ટાફ વધુ વિગતવાર સહાય પૂરી પાડી શકે છે. શું તમે ઇચ્છો છો કે હું તમને માનવ સહાય સાથે જોડું?",
    ta: "மன்னிக்கவும், அதைப் பற்றி எனக்கு குறிப்பிட்ட தகவல் இல்லை. எங்கள் அலுவலக ஊழியர்கள் மிக விரிவான உதவியை வழங்க முடியும். நான் உங்களை மனித ஆதரவுடன் இணைக்க வேண்டுமா?"
  };
  return responses[language] || responses.en;
};

const getSuggestions = (category: string, language: Language): string[] => {
  const suggestions: { [key: string]: { [key in Language]: string[] } } = {
    'Admissions': {
      en: ['What documents are needed?', 'When is the admission deadline?', 'How to apply online?'],
      hi: ['कौन से दस्तावेज़ चाहिए?', 'प्रवेश की अंतिम तारीख कब है?', 'ऑनलाइन आवेदन कैसे करें?'],
      mr: ['कोणती कागदपत्रे लागतात?', 'प्रवेशाची शेवटची तारीख केव्हा आहे?', 'ऑनलाइन अर्ज कसा करावा?'],
      gu: ['કયા દસ્તાવેજોની જરૂર છે?', 'પ્રવેશની અંતિમ તારીખ ક્યારે છે?', 'ઓનલાઇન અરજી કેવી રીતે કરવી?'],
      ta: ['என்ன ஆவணங்கள் தேவை?', 'சேர்க்கைக்கான கடைசி தேதி எப்போது?', 'ஆன்லைனில் எவ்வாறு விண்ணப்பிப்பது?']
    },
    'Fees & Scholarships': {
      en: ['What scholarships are available?', 'Can I pay fees in installments?', 'How to apply for financial aid?'],
      hi: ['कौन सी छात्रवृत्तियां उपलब्ध हैं?', 'क्या मैं किश्तों में फीस दे सकता हूं?', 'वित्तीय सहायता के लिए कैसे आवेदन करें?'],
      mr: ['कोणती शिष्यवृत्ती उपलब्ध आहे?', 'मी हप्त्यांमध्ये फी भरू शकतो का?', 'आर्थिक मदतीसाठी अर्ज कसा करावा?'],
      gu: ['કયા શિષ્યવૃત્તિ ઉપલબ્ધ છે?', 'શું હું હપ્તામાં ફી ભરી શકું?', 'નાણાકીય સહાય માટે કેવી રીતે અરજી કરવી?'],
      ta: ['என்ன छात्रवृत्ति கிடைக்கும்?', 'கட்டணத்தை தவணையில் செலுத்த முடியுமா?', 'நிதி உதவிக்கு எவ்வாறு விண்ணப்பிப்பது?']
    }
  };

  return suggestions[category]?.[language] || suggestions[category]?.en || [];
};

const getGeneralSuggestions = (language: Language): string[] => {
  const suggestions = {
    en: ['Admission requirements', 'Fee structure', 'Hostel facilities', 'Library timings', 'Exam schedule'],
    hi: ['प्रवेश आवश्यकताएं', 'फीस संरचना', 'छात्रावास सुविधाएं', 'पुस्तकालय समय', 'परीक्षा कार्यक्रम'],
    mr: ['प्रवेश आवश्यकता', 'फी रचना', 'वसतिगृह सुविधा', 'ग्रंथालय वेळ', 'परीक्षा वेळापत्रक'],
    gu: ['પ્રવેશ આવશ્યકતાઓ', 'ફી માળખું', 'હોસ્ટેલ સુવિધાઓ', 'પુસ્તકાલય સમય', 'પરીક્ષા સમયપત્રક'],
    ta: ['சேர்க்கை தேவைகள்', 'கட்டண கட்டமைப்பு', 'விடுதி வசதிகள்', 'நூலக நேரங்கள்', 'தேர்வு அட்டவணை']
  };
  return suggestions[language] || suggestions.en;
};

const handleContextualQuery = (
  input: string, 
  history: Message[], 
  language: Language
): ChatResponse | null => {
  if (history.length === 0) return null;

  const lastBotMessage = [...history].reverse().find(msg => msg.isBot);
  if (!lastBotMessage) return null;

  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('more') || lowerInput.includes('detail') || lowerInput.includes('और') || lowerInput.includes('अधिक')) {

    if (lastBotMessage.content.includes('admission') || lastBotMessage.content.includes('प्रवेश')) {
      const responses = {
        en: "For more detailed admission information: You can apply online through our website. Required documents include 12th mark sheet, transfer certificate, and entrance exam scorecard. Application fee is ₹500.",
        hi: "अधिक विस्तृत प्रवेश जानकारी के लिए: आप हमारी वेबसाइट के माध्यम से ऑनलाइन आवेदन कर सकते हैं। आवश्यक दस्तावेजों में 12वीं की मार्कशीट, स्थानांतरण प्रमाणपत्र और प्रवेश परीक्षा स्कोरकार्ड शामिल हैं। आवेदन शुल्क ₹500 है।"
      };
      return {
        content: responses[language] || responses.en,
        needsHumanHelp: false
      };
    }
  }

  return null;
};