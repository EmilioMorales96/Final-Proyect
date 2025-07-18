import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiCloud, 
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrendingUp,
  FiZap,
  FiDatabase,
  FiLink,
  FiUser,
  FiSettings,
  FiExternalLink,
  FiTarget,
  FiMail
} from 'react-icons/fi';
import { 
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlinePhone
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import LeadScoringDashboard from './LeadScoringDashboard';
import EmailAutomationDashboard from './EmailAutomationDashboard';

const SalesforceDashboard = () => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  // Estados
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({});
  const [syncHistory, setSyncHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Función para parsear el estado de conexión
  const parseConnectionStatus = (data) => {
    // Personaliza según la respuesta real de tu API
    return data && data.connected === true;
  };

  // Funciones principales
  const checkSalesforceConnection = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsConnected(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/salesforce/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setIsConnected(parseConnectionStatus(data));
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking Salesforce connection:', error);
      setIsConnected(false);
    }
  }, [API_URL]);

  const fetchSyncHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_URL}/api/salesforce/sync-history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSyncHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching sync history:', error);
    }
  }, [API_URL]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_URL}/api/salesforce/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [API_URL]);

  // Cargar datos al montar el componente
  useEffect(() => {
    checkSalesforceConnection();
    fetchStats();
    fetchSyncHistory();
  }, [checkSalesforceConnection, fetchStats, fetchSyncHistory]);

  const testConnection = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error(t('dashboard.salesforce.networkError'));
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/salesforce/test-connection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: '+1234567890',
          industry: 'Technology'
        })
      });
      if (response.ok) {
        toast.success(t('dashboard.salesforce.connectionSuccess'));
        setIsConnected(true);
        checkSalesforceConnection();
      } else if (response.status === 404) {
        toast.error(t('dashboard.salesforce.endpointNotFound'));
      } else {
        const data = await response.json();
        toast.error(data.message || t('dashboard.salesforce.connectionError'));
      }
    } catch (error) {
      toast.error(t('dashboard.salesforce.networkError'));
      console.error('Connection test error:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, t, checkSalesforceConnection]);

  // ...existing code...

  // Función para manejar la autenticación con Salesforce
  const handleSalesforceAuth = () => {
    window.location.href = `${API_URL}/api/salesforce/auth`;
  };

  const dashboardTabs = [
    {
      id: 'overview',
      name: t('dashboard.salesforce.overview'),
      icon: <HiOutlineChartBar className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'leads',
      name: t('dashboard.salesforce.leadScoring'),
      icon: <FiTarget className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'emails',
      name: t('dashboard.salesforce.emailAutomation'),
      icon: <FiMail className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 'connection',
      name: t('dashboard.salesforce.connection'),
      icon: <FiLink className="w-5 h-5" />,
      color: 'orange'
    },
    {
      id: 'history',
      name: t('dashboard.salesforce.history'),
      icon: <FiClock className="w-5 h-5" />,
      color: 'indigo'
    }
  ];

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.type === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <FiTrendingUp className="w-4 h-4 mr-1" />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Estado de conexión prominente */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <FiXCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-yellow-900">
                {t('dashboard.salesforce.notConnected')}
              </h3>
              <p className="text-yellow-700 mt-1">
                {t('dashboard.salesforce.notConnectedDesc')}
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleSalesforceAuth}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>{t('dashboard.salesforce.connectButton')}</span>
                  <FiExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={testConnection}
                  disabled={loading}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>{t('dashboard.salesforce.testConnection')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('dashboard.stats.accountsCreated')}
          value={stats?.totalAccounts || '0'}
          subtitle={t('dashboard.stats.totalRegistered')}
          icon={<HiOutlineBriefcase className="w-6 h-6 text-blue-600" />}
          color="blue"
          trend={{ type: 'up', value: '+12%' }}
        />
        <StatCard
          title={t('dashboard.stats.activeContacts')}
          value={stats?.totalContacts || '0'}
          subtitle={t('dashboard.stats.inSalesforce')}
          icon={<HiOutlineUserGroup className="w-6 h-6 text-purple-600" />}
          color="purple"
          trend={{ type: 'up', value: '+8%' }}
        />
        <StatCard
          title={t('dashboard.stats.successfulIntegrations')}
          value={stats?.successfulSyncs || '0'}
          subtitle={t('dashboard.stats.thisMonth')}
          icon={<FiDatabase className="w-6 h-6 text-green-600" />}
          color="green"
          trend={{ type: 'up', value: '+24%' }}
        />
        <StatCard
          title={t('dashboard.stats.successRate')}
          value="98.5%"
          subtitle={t('dashboard.stats.successfulOperations')}
          icon={<FiZap className="w-6 h-6 text-orange-600" />}
          color="orange"
          trend={{ type: 'up', value: '+2%' }}
        />
      </div>

      {/* Guía de inicio rápido */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickStart.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{t('dashboard.quickStart.step1.title')}</h4>
              <p className="text-sm text-gray-600">{t('dashboard.quickStart.step1.desc')}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{t('dashboard.quickStart.step2.title')}</h4>
              <p className="text-sm text-gray-600">{t('dashboard.quickStart.step2.desc')}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{t('dashboard.quickStart.step3.title')}</h4>
              <p className="text-sm text-gray-600">{t('dashboard.quickStart.step3.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ConnectionTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.connection.title')}</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-medium text-gray-900">Estado de API</p>
                <p className="text-sm text-gray-600">
                  {isConnected ? t('dashboard.connection.connected') : t('dashboard.connection.disconnected')}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? t('dashboard.connection.statusActive') : t('dashboard.connection.statusInactive')}
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSalesforceAuth}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiUser className="w-4 h-4" />
              <span>{t('dashboard.salesforce.connectButton')}</span>
              <FiExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? t('dashboard.salesforce.testing') : t('dashboard.salesforce.testConnection')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Información de configuración */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-medium text-blue-900 mb-2">{t('dashboard.salesforce.configuration.helpTitle')}</h4>
        <p className="text-blue-700 text-sm mb-3">
          {t('dashboard.salesforce.configuration.helpText')}
        </p>
        <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
          <li>{t('dashboard.salesforce.configuration.connectedApp')}</li>
          <li>{t('dashboard.salesforce.configuration.oauthPermissions')}</li>
          <li>{t('dashboard.salesforce.configuration.callbackUrl')}</li>
          <li>{t('dashboard.salesforce.configuration.apiAccess')}</li>
        </ul>
      </div>
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.salesforce.history.title')}</h3>
        </div>
        
        {syncHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.salesforce.table.date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.salesforce.table.type')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.salesforce.table.result')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.salesforce.table.status')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {syncHistory.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.records || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'success' ? 'Exitoso' : 'Error'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.salesforce.history.noActivity')}</h3>
            <p className="text-gray-600">
              {t('dashboard.salesforce.history.noActivityDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    const mockLeads = [
      {
        id: 1,
        company: 'Acme Corp',
        industry: 'technology',
        numberOfEmployees: '100-249',
        annualRevenue: 2500000,
        phone: '+1-555-0123',
        website: 'https://acme.com',
        behaviorData: { formSubmissions: 2, websiteVisits: 5, demoRequested: true }
      },
      {
        id: 2,
        company: 'TechStart Inc',
        industry: 'technology',
        numberOfEmployees: '50-99',
        annualRevenue: 800000,
        phone: '+1-555-0456',
        website: 'https://techstart.com',
        behaviorData: { formSubmissions: 1, websiteVisits: 3, demoRequested: false }
      },
      {
        id: 3,
        company: 'Global Manufacturing',
        industry: 'manufacturing',
        numberOfEmployees: '500-999',
        annualRevenue: 15000000,
        phone: '+1-555-0789',
        website: 'https://globalmfg.com',
        behaviorData: { formSubmissions: 1, websiteVisits: 8, demoRequested: true }
      }
    ];

    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'leads':
        return <LeadScoringDashboard leads={mockLeads} onLeadSelect={(lead) => console.log('Selected lead:', lead)} />;
      case 'emails':
        return <EmailAutomationDashboard leads={mockLeads} />;
      case 'connection':
        return <ConnectionTab />;
      case 'history':
        return <HistoryTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCloud className="w-6 h-6 text-blue-600" />
            </div>
            <span>Salesforce Dashboard</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Monitorea y gestiona tu integración con Salesforce CRM
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? (
              <FiCheckCircle className="w-4 h-4" />
            ) : (
              <FiXCircle className="w-4 h-4" />
            )}
            <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>
      </div>

      {/* Navegación de tabs */}
      <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl">
        {dashboardTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-white text-${tab.color}-600 shadow-sm`
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div className="transition-all duration-300">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SalesforceDashboard;
