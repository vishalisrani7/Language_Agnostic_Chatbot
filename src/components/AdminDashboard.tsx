import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  BarChart, 
  MessageSquare, 
  Users, 
  FileText, 
  Plus, 
  Search,
  LogOut,
  Settings,
  TrendingUp,
  Clock,
  Languages
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import FAQManager from './FAQManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import ConversationLogs from './ConversationLogs';

interface AdminDashboardProps {
  user: User;
}

type Tab = 'overview' | 'faqs' | 'conversations' | 'analytics' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalFAQs: 0,
    averageResolution: 0,
    userSatisfaction: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        totalConversations: 1247,
        totalFAQs: 156,
        averageResolution: 2.3,
        userSatisfaction: 4.2
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'faqs', label: 'FAQ Management', icon: FileText },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Campus Assistant Admin</h1>
                <p className="text-sm text-gray-500">Manage your multilingual chatbot</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
        
          <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Conversations</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalConversations.toLocaleString()}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total FAQs</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalFAQs}</p>
                      </div>
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Resolution (mins)</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.averageResolution}</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">User Satisfaction</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.userSatisfaction}/5</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { action: 'New FAQ added', category: 'Scholarships', language: 'Hindi', time: '2 hours ago' },
                        { action: 'Conversation logged', satisfaction: '5/5', language: 'English', time: '3 hours ago' },
                        { action: 'FAQ updated', category: 'Admissions', language: 'Marathi', time: '5 hours ago' },
                        { action: 'High traffic detected', queries: '50+ queries', language: 'Multiple', time: '1 day ago' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Languages className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-600">
                                {activity.category && `Category: ${activity.category}`}
                                {activity.satisfaction && `Satisfaction: ${activity.satisfaction}`}
                                {activity.queries && activity.queries}
                                {' • '}Language: {activity.language}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faqs' && <FAQManager />}
            {activeTab === 'conversations' && <ConversationLogs />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Language Configuration</h3>
                      <div className="space-y-3">
                        {Object.entries({
                          en: 'English',
                          hi: 'Hindi',
                          mr: 'Marathi',
                          gu: 'Gujarati',
                          ta: 'Tamil'
                        }).map(([code, name]) => (
                          <label key={code} className="flex items-center">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 mr-3" />
                            <span className="text-gray-700">{name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input type="text" placeholder="+91-XXX-XXXX-XXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input type="email" placeholder="help@college.edu" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;