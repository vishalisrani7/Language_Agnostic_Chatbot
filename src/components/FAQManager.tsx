import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X } from 'lucide-react';
import { FAQ, Language } from '../types';
import { languages } from '../lib/translation';

const FAQManager: React.FC = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: '',
    language: 'en' as Language,
    keywords: [] as string[]
  });

  const categories = [
    'Admissions',
    'Fees & Scholarships',
    'Academic Calendar',
    'Examinations',
    'Library',
    'Hostel',
    'Transportation',
    'General Queries'
  ];

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    const mockFAQs: FAQ[] = [
      {
        id: '1',
        question: 'What are the admission requirements?',
        answer: 'For undergraduate programs, you need to have completed 12th grade with a minimum of 75% marks. You also need to clear our entrance examination.',
        category: 'Admissions',
        language: 'en',
        keywords: ['admission', 'requirements', 'eligibility', '12th', 'entrance'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        question: 'प्रवेश की आवश्यकताएं क्या हैं?',
        answer: 'स्नातक कार्यक्रमों के लिए, आपको न्यूनतम 75% अंकों के साथ 12वीं कक्षा पूरी करनी होगी। आपको हमारी प्रवेश परीक्षा भी उत्तीर्ण करनी होगी।',
        category: 'Admissions',
        language: 'hi',
        keywords: ['प्रवेश', 'आवश्यकताएं', 'योग्यता', '12वीं', 'परीक्षा'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    setFAQs(mockFAQs);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesLanguage = faq.language === selectedLanguage;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleAddFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer || !newFAQ.category) return;

    const faq: FAQ = {
      id: Date.now().toString(),
      ...newFAQ,
      keywords: newFAQ.keywords.length > 0 ? newFAQ.keywords : [newFAQ.question.split(' ').slice(0, 3).join(' ')],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setFAQs(prev => [...prev, faq]);
    setNewFAQ({ question: '', answer: '', category: '', language: 'en', keywords: [] });
    setIsAddingFAQ(false);
  };

  const handleDeleteFAQ = async (id: string) => {
    setFAQs(prev => prev.filter(faq => faq.id !== id));
  };

  const handleEditFAQ = async (id: string, updatedFAQ: Partial<FAQ>) => {
    setFAQs(prev => prev.map(faq => 
      faq.id === id 
        ? { ...faq, ...updatedFAQ, updated_at: new Date().toISOString() }
        : faq
    ));
    setEditingFAQ(null);
  };

  return (
    <div className="space-y-6">
    
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
        <button
          onClick={() => setIsAddingFAQ(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isAddingFAQ && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New FAQ</h3>
            <button
              onClick={() => setIsAddingFAQ(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newFAQ.category}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={newFAQ.language}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, language: e.target.value as Language }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <input
              type="text"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the FAQ question..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
            <textarea
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Enter the FAQ answer..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
            <input
              type="text"
              value={newFAQ.keywords.join(', ')}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) }))}
              placeholder="keywords, search, terms"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAddFAQ}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save FAQ</span>
            </button>
            <button
              onClick={() => setIsAddingFAQ(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {faq.category}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {languages[faq.language]}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingFAQ(faq.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFAQ(faq.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingFAQ === faq.id ? (
              <EditFAQForm
                faq={faq}
                onSave={(updatedFAQ) => handleEditFAQ(faq.id, updatedFAQ)}
                onCancel={() => setEditingFAQ(null)}
                categories={categories}
              />
            ) : (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700 mb-3">{faq.answer}</p>
                <div className="flex flex-wrap gap-2">
                  {faq.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded border border-gray-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No FAQs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface EditFAQFormProps {
  faq: FAQ;
  onSave: (updatedFAQ: Partial<FAQ>) => void;
  onCancel: () => void;
  categories: string[];
}

const EditFAQForm: React.FC<EditFAQFormProps> = ({ faq, onSave, onCancel, categories }) => {
  const [editedFAQ, setEditedFAQ] = useState({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    language: faq.language,
    keywords: faq.keywords
  });

  const handleSave = () => {
    onSave(editedFAQ);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={editedFAQ.category}
            onChange={(e) => setEditedFAQ(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={editedFAQ.language}
            onChange={(e) => setEditedFAQ(prev => ({ ...prev, language: e.target.value as Language }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
        <input
          type="text"
          value={editedFAQ.question}
          onChange={(e) => setEditedFAQ(prev => ({ ...prev, question: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
        <textarea
          value={editedFAQ.answer}
          onChange={(e) => setEditedFAQ(prev => ({ ...prev, answer: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
        <input
          type="text"
          value={editedFAQ.keywords.join(', ')}
          onChange={(e) => setEditedFAQ(prev => ({ ...prev, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FAQManager;