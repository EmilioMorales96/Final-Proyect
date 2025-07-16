import { useState, useEffect } from 'react';
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
  FiExternalLink
} from 'react-icons/fi';
import { 
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineBriefcase
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const SalesforceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const [syncHistory, setSyncHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkSalesforceConnection();
    fetchSyncHistory();
    fetchStats();
  }, []);

  const checkSalesforceConnection = async () => {
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
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking Salesforce connection:', error);
      setIsConnected(false);
    }
  };

  const fetchSyncHistory = async () => {
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
  };

  const fetchStats = async () => {
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
  };

  const handleSalesforceAuth = () => {
    // Usar nuestro endpoint de autorización del backend
    const authUrl = `${API_URL}/api/salesforce/oauth/authorize`;
    window.open(authUrl, '_blank', 'width=600,height=400');
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Necesitas iniciar sesión primero');
        return;
      }

      const response = await fetch(`${API_URL}/api/salesforce/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          company: 'Test Company',
          phone: '+1234567890',
          industry: 'Technology'
        })
      });

      if (response.ok) {
        toast.success('¡Conexión con Salesforce exitosa!');
        setIsConnected(true);
        checkSalesforceConnection();
      } else if (response.status === 404) {
        toast.error('Endpoint no encontrado. Verifica la configuración del servidor.');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Error de conexión con Salesforce');
      }
    } catch (error) {
      toast.error('Error de red. Verifica tu conexión.');
      console.error('Connection test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardTabs = [
    {
      id: 'overview',
      name: 'Vista General',
      icon: <HiOutlineChartBar className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'connection',
      name: 'Conexión',
      icon: <FiLink className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 'history',
      name: 'Historial',
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
                Salesforce no está conectado
              </h3>
              <p className="text-yellow-700 mt-1">
                Para usar todas las funcionalidades, necesitas conectar tu cuenta de Salesforce.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleSalesforceAuth}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Conectar con Salesforce</span>
                  <FiExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={testConnection}
                  disabled={loading}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>Probar Conexión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cuentas Creadas"
          value={stats?.totalAccounts || '0'}
          subtitle="Total registradas"
          icon={<HiOutlineBriefcase className="w-6 h-6 text-blue-600" />}
          color="blue"
          trend={{ type: 'up', value: '+12%' }}
        />
        <StatCard
          title="Contactos Activos"
          value={stats?.totalContacts || '0'}
          subtitle="En Salesforce"
          icon={<HiOutlineUserGroup className="w-6 h-6 text-purple-600" />}
          color="purple"
          trend={{ type: 'up', value: '+8%' }}
        />
        <StatCard
          title="Integraciones Exitosas"
          value={stats?.successfulSyncs || '0'}
          subtitle="Este mes"
          icon={<FiDatabase className="w-6 h-6 text-green-600" />}
          color="green"
          trend={{ type: 'up', value: '+24%' }}
        />
        <StatCard
          title="Tasa de Éxito"
          value="98.5%"
          subtitle="Operaciones exitosas"
          icon={<FiZap className="w-6 h-6 text-orange-600" />}
          color="orange"
          trend={{ type: 'up', value: '+2%' }}
        />
      </div>

      {/* Guía de inicio rápido */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guía de Inicio Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Conectar Salesforce</h4>
              <p className="text-sm text-gray-600">Autoriza la aplicación para acceder a tu cuenta de Salesforce</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Crear Cuentas</h4>
              <p className="text-sm text-gray-600">Usa la integración manual para crear cuentas y contactos</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Monitorear</h4>
              <p className="text-sm text-gray-600">Revisa el historial y estadísticas de tus integraciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ConnectionTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Conexión con Salesforce</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-medium text-gray-900">Estado de API</p>
                <p className="text-sm text-gray-600">{isConnected ? 'Conectado y funcionando' : 'Desconectado o con errores'}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSalesforceAuth}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiUser className="w-4 h-4" />
              <span>Conectar / Reautorizar Salesforce</span>
              <FiExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Probando...' : 'Probar Conexión'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Información de configuración */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-medium text-blue-900 mb-2">¿Necesitas ayuda con la configuración?</h4>
        <p className="text-blue-700 text-sm mb-3">
          Si tienes problemas para conectar con Salesforce, verifica que:
        </p>
        <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
          <li>Tu Connected App esté configurado correctamente</li>
          <li>Los permisos OAuth estén habilitados</li>
          <li>La URL de callback esté registrada</li>
          <li>Tengas acceso API en tu licencia de Salesforce</li>
        </ul>
      </div>
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Actividades</h3>
        </div>
        
        {syncHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividad reciente</h3>
            <p className="text-gray-600">
              Las actividades de Salesforce aparecerán aquí una vez que comiences a usar la integración.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
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
