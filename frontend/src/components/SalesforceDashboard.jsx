import { useState, useEffect } from 'react';
import { 
  FiCloud, 
  FiUser, 
  FiPhone, 
  FiGlobe, 
  FiBriefcase, 
  FiDollarSign, 
  FiUsers,
  FiActivity,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBarChart
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Advanced Salesforce Dashboard Component
 * Provides comprehensive Salesforce integration management
 */
export const SalesforceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [salesforceStatus, setSalesforceStatus] = useState(null);
  const [syncHistory, setSyncHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesforceStatus();
    fetchSyncHistory();
    fetchStats();
  }, []);

  const fetchSalesforceStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/oauth/status`);
      const data = await response.json();
      setSalesforceStatus(data.salesforce);
    } catch (error) {
      console.error('Error fetching Salesforce status:', error);
    }
  };

  const fetchSyncHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/salesforce/sync-history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSyncHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching sync history:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/salesforce/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const syncAllForms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/salesforce/sync-all-forms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Synced ${data.synced} forms to Salesforce!`);
        fetchSyncHistory();
        fetchStats();
      } else {
        toast.error(data.message || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'sync', label: 'Sync Forms', icon: FiRefreshCw },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl mr-4">
            <FiCloud className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Salesforce Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              CRM Integration & Lead Management
            </p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center">
          {salesforceStatus?.configured ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <FiCheckCircle className="mr-2" />
              <span className="font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <FiXCircle className="mr-2" />
              <span className="font-medium">Not Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Accounts</p>
                  <p className="text-2xl font-bold">{stats?.totalAccounts || 0}</p>
                </div>
                <FiBriefcase className="text-2xl text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Contacts</p>
                  <p className="text-2xl font-bold">{stats?.totalContacts || 0}</p>
                </div>
                <FiUsers className="text-2xl text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Forms Synced</p>
                  <p className="text-2xl font-bold">{stats?.syncedForms || 0}</p>
                </div>
                <FiRefreshCw className="text-2xl text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">{stats?.successRate || 0}%</p>
                </div>
                <FiBarChart className="text-2xl text-orange-200" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={syncAllForms}
                disabled={loading}
                className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Sync All Forms
              </button>
              
              <button className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <FiBriefcase className="mr-2" />
                Create Account
              </button>
              
              <button className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <FiUser className="mr-2" />
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sync History
          </h3>
          
          {syncHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiClock className="mx-auto text-4xl mb-2" />
              <p>No sync history available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {syncHistory.map((sync, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    {sync.status === 'success' ? (
                      <FiCheckCircle className="text-green-500 mr-3" />
                    ) : (
                      <FiXCircle className="text-red-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {sync.type}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sync.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {sync.count} items
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Form Synchronization
          </h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <FiRefreshCw className="text-blue-600 dark:text-blue-400 mt-1 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Automatic Sync Available
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                  Sync all form responses to Salesforce as Accounts and Contacts automatically.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={syncAllForms}
            disabled={loading}
            className="w-full flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Start Full Sync'}
          </button>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Salesforce Analytics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Lead Sources
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Forms App</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats?.leadSources?.forms || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Direct Entry</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats?.leadSources?.direct || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Industry Distribution
              </h4>
              <div className="space-y-2">
                {stats?.industries?.map((industry, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {industry.name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {industry.count}
                    </span>
                  </div>
                )) || (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No data available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesforceDashboard;
