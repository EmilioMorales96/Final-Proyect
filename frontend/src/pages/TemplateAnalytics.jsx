import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

export default function TemplateAnalytics() {
  const { templateId } = useParams();
  const { token, user } = useAuth();
  const [template, setTemplate] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (templateId && token) {
      fetchAnalytics();
    }
  }, [templateId, token]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch template info
      const templateResponse = await fetch(`${API_URL}/api/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (templateResponse.ok) {
        const templateData = await templateResponse.json();
        setTemplate(templateData);
      }

      // Fetch analytics data
      const analyticsResponse = await fetch(`${API_URL}/api/templates/${templateId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!template || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics: {template.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights and statistics for your template responses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalResponses}</div>
          <div className="text-gray-600 dark:text-gray-400">Total Responses</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">{analytics.averageCompletionTime}s</div>
          <div className="text-gray-600 dark:text-gray-400">Avg. Completion Time</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">{analytics.completionRate}%</div>
          <div className="text-gray-600 dark:text-gray-400">Completion Rate</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-orange-600">{analytics.uniqueUsers}</div>
          <div className="text-gray-600 dark:text-gray-400">Unique Users</div>
        </div>
      </div>

      {/* Question Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {analytics.questionAnalytics?.map((questionData, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {questionData.questionText}
            </h3>
            
            {questionData.type === 'radio' || questionData.type === 'checkbox' ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={questionData.distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {questionData.distribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : questionData.type === 'rating' || questionData.type === 'linear' ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionData.distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="value" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Most Common Answer:</span>
                  <span className="font-medium">{questionData.mostCommon}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Length:</span>
                  <span className="font-medium">{questionData.averageLength} chars</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Responses:</span>
                  <span className="font-medium">{questionData.totalResponses}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Response Timeline */}
      {analytics.timeline && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Response Timeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="responses" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
