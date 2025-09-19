import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language, languages } from '../lib/translation';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {languages[currentLanguage]}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        {Object.entries(languages).map(([code, name]) => (
          <button
            key={code}
            onClick={() => onLanguageChange(code as Language)}
            className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
              currentLanguage === code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;