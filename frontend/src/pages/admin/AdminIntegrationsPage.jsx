import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaCode, 
  FaCloud, 
  FaShieldAlt, 
  FaQuestionCircle,
  FaChartLine,
  FaCog,
  FaLightbulb
} from 'react-icons/fa';
import { 
  HiOutlineCloud,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';
import SalesforceIntegration from '../../components/SalesforceIntegration';
import SalesforceDashboard from '../../components/SalesforceDashboard';
import toast from 'react-hot-toast';

const AdminIntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle OAuth callback parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const details = urlParams.get('details');

    if (success === 'oauth_connected') {
      toast.success('¡Salesforce conectado exitosamente!');
      // Clean URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      let errorMessage = 'Error en la conexión con Salesforce';
      switch (error) {
        case 'oauth_failed':
          errorMessage = `OAuth falló: ${details || 'Error desconocido'}`;
          break;
        case 'no_code':
          errorMessage = 'No se recibió código de autorización';
          break;
        case 'token_exchange_failed':
          errorMessage = 'Error al intercambiar tokens';
          break;
        case 'callback_failed':
          errorMessage = 'Error en el callback de OAuth';
          break;
      }
      toast.error(errorMessage);
      // Clean URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const integrationTabs = [
    {
      id: 'dashboard',
      name: 'Dashboard Analytics',
      description: 'Vista general y métricas de Salesforce',
      icon: <HiOutlineChartBar className="w-6 h-6" />,
      color: 'blue',
      component: <SalesforceDashboard />
    },
    {
      id: 'salesforce',
      name: 'Salesforce CRM',
      description: 'Gestión manual de cuentas y contactos',
      icon: <HiOutlineCloud className="w-6 h-6" />,
      color: 'indigo',
      component: <SalesforceIntegration />
    },
    {
      id: 'api-tokens',
      name: 'API Configuration',
      description: 'Configuración de tokens y credenciales',
      icon: <HiOutlineCog className="w-6 h-6" />,
      color: 'gray',
      component: <APITokensTab />
    },
    {
      id: 'security',
      name: 'Security Settings',
      description: 'Configuración de seguridad y permisos',
      icon: <HiOutlineShieldCheck className="w-6 h-6" />,
      color: 'green',
      component: <SecurityTab />
    },
    {
      id: 'help',
      name: 'Help & Documentation',
      description: 'Guías y resolución de problemas',
      icon: <HiOutlineQuestionMarkCircle className="w-6 h-6" />,
      color: 'yellow',
      component: <HelpTab />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header con gradiente Salesforce */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <HiOutlineCloud className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Salesforce Integration Center
              </h1>
              <p className="text-blue-100 mt-1">
                Gestiona tu integración con Salesforce CRM de forma completa
              </p>
            </div>
          </div>
          
          {/* Stats rápidas en el header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <HiOutlineChartBar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Status de conexión</p>
                  <p className="text-lg font-semibold">Conectado</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <FaLightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Última sincronización</p>
                  <p className="text-lg font-semibold">Hace 2 min</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <FaChartLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Registros sincronizados</p>
                  <p className="text-lg font-semibold">1,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navegación con tarjetas mejoradas */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {integrationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-${tab.color}-50 shadow-lg scale-105`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div className={`inline-flex p-3 rounded-lg mb-4 ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-500 text-white` 
                    : `bg-gray-100 text-gray-600 group-hover:bg-${tab.color}-100 group-hover:text-${tab.color}-600`
                }`}>
                  {tab.icon}
                </div>
                <h3 className={`font-semibold mb-2 ${
                  activeTab === tab.id ? `text-${tab.color}-900` : 'text-gray-900'
                }`}>
                  {tab.name}
                </h3>
                <p className={`text-sm ${
                  activeTab === tab.id ? `text-${tab.color}-700` : 'text-gray-600'
                }`}>
                  {tab.description}
                </p>
                
                {/* Indicador activo */}
                {activeTab === tab.id && (
                  <div className={`absolute top-3 right-3 w-3 h-3 bg-${tab.color}-500 rounded-full animate-pulse`}></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Panel de contenido con animación */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="transition-all duration-500 ease-in-out">
              {integrationTabs.find(tab => tab.id === activeTab)?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const APITokensTab = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {t('admin.integrations.apiTokens')}
      </h3>
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-800">
          {t('admin.integrations.apiTokensDescription')}
        </p>
      </div>
      <div className="space-y-4">
        <div className="border border-gray-300 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Salesforce API Token</h4>
          <p className="text-sm text-gray-600 mb-3">
            Configure your Salesforce API credentials for integration
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumer Key
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter consumer key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consumer Secret
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter consumer secret"
              />
            </div>
          </div>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

const SecurityTab = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {t('admin.integrations.security')}
      </h3>
      <div className="bg-green-50 p-4 rounded-md">
        <p className="text-green-800">
          All integrations are secured with OAuth 2.0 and encrypted data transmission.
        </p>
      </div>
      <div className="space-y-4">
        <div className="border border-gray-300 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Security Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">
                Enable two-factor authentication for integrations
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">
                Log all integration activities
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="ml-2 text-sm text-gray-700">
                Require admin approval for new integrations
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const HelpTab = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {t('admin.integrations.help')}
      </h3>
      <div className="space-y-4">
        <div className="border border-gray-300 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Salesforce Integration Guide</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. Create a Connected App in Salesforce</p>
            <p>2. Configure OAuth settings with proper callback URL</p>
            <p>3. Copy Consumer Key and Consumer Secret</p>
            <p>4. Configure the credentials in the API Tokens tab</p>
            <p>5. Test the connection using the Dashboard tab</p>
          </div>
        </div>
        <div className="border border-gray-300 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Common Issues</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Connection Failed:</strong> Check your credentials and network connection</p>
            <p><strong>Authorization Error:</strong> Verify callback URL matches exactly</p>
            <p><strong>Rate Limits:</strong> Salesforce API has daily limits, check usage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrationsPage;
