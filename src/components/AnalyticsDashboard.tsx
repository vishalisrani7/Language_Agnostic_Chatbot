import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Clock, Users, Globe, Star } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState({
    conversationTrends: [],
    languageDistribution: [],
    popularQueries: [],
    satisfactionRatings: [],
    responseTime: [],
    userEngagement: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    const mockData = {
      conversationTrends: [
        { date: '2025-01-01', conversations: 45 },
        { date: '2025-01-02', conversations: 67 },
        { date: '2025-01-03', conversations: 89 },
        { date: '2025-01-04', conversations: 76 },
        { date: '2025-01-05', conversations: 98 },
        { date: '2025-01-06', conversations: 112 },
        { date: '2025-01-07', conversations: 134 }
      ],
      languageDistribution: [
        { language: 'English', count: 456, percentage: 45.6 },
        { language: 'Hindi', count: 312, percentage: 31.2 },
        { language: 'Marathi', count: 156, percentage: 15.6 },
        { language: 'Gujarati', count: 76, percentage: 7.6 }
      ],
      popularQueries: [
        { query: 'Admission requirements', count: 89, category: 'Admissions' },
        { query: 'Fee structure', count: 76, category: 'Fees & Scholarships' },
        { query: 'Hostel facilities', count: 65, category: 'Hostel' },
        { query: 'Exam schedule', count: 54, category: 'Examinations' },
        { query: 'Library timings', count: 43, category: 'Library' }
      ],
      satisfactionRatings: [
        { rating: 5, count: 234 },
        { rating: 4, count: 189 },
        { rating: 3, count: 76 },
        { rating: 2, count: 23 },
        { rating: 1, count: 12 }
      ],
      responseTime: [
        { time: '< 1s', count: 345 },
        { time: '1-3s', count: 234 },
        { time: '3-5s', count: 123 },
        { time: '> 5s', count: 45 }
      ]
    };
    setAnalytics(mockData);
  };

  const timeRangeLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days'
  };

  return (
    <div className="space-y-6">
   
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {Object.entries(timeRangeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeRange(key as '7d' | '30d' | '90d')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Conversations</p>
              <p className="text-3xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+12% from last period</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900">1.8s</p>
              <p className="text-sm text-green-600">-0.3s faster</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">User Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900">4.2/5</p>
              <p className="text-sm text-green-600">+0.1 improvement</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Languages</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
              <p className="text-sm text-blue-600">Multi-lingual ready</p>
            </div>
            <Globe className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Language Distribution</h3>
          <div className="space-y-3">
            {analytics.languageDistribution.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-600' :
                    index === 1 ? 'bg-green-600' :
                    index === 2 ? 'bg-yellow-600' : 'bg-purple-600'
                  }`}></div>
                  <span className="text-gray-700">{lang.language}</span>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-medium">{lang.count}</div>
                  <div className="text-sm text-gray-500">{lang.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Queries</h3>
          <div className="space-y-3">
            {analytics.popularQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900 font-medium">{query.query}</div>
                  <div className="text-sm text-gray-500">{query.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-medium">{query.count}</div>
                  <div className="text-sm text-gray-500">queries</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Satisfaction</h3>
          <div className="space-y-3">
            {analytics.satisfactionRatings.map((rating, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(rating.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  {[...Array(5 - rating.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-300" />
                  ))}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${(rating.count / 534) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Response Time Distribution</h3>
          <div className="space-y-3">
            {analytics.responseTime.map((time, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{time.time}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-green-600' :
                        index === 1 ? 'bg-yellow-600' :
                        index === 2 ? 'bg-orange-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${(time.count / 345) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{time.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation Trends</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analytics.conversationTrends.map((trend, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-600 rounded-t"
                style={{ height: `${(trend.conversations / 134) * 200}px` }}
              ></div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Export Analytics</h3>
            <p className="text-gray-600 mt-1">Download comprehensive reports for the selected time period</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Export PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;