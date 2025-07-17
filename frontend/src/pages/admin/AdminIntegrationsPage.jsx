import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  FaCode, 
  FaCloud, 
  FaShieldAlt, 
  FaQuestionCircle,
  FaChartLine,
  FaCog,
  FaLightbulb,
  FaArrowLeft
} from 'react-icons/fa';
import { 
  HiOutlineCloud,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle,
  HiArrowLeft
} from 'react-icons/hi';
import SalesforceIntegration from '../../components/SalesforceIntegration';
import SalesforceDashboard from '../../components/SalesforceDashboard';
import toast from 'react-hot-toast';

const AdminIntegrationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle OAuth callback parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const details = urlParams.get('details');

    if (success === 'oauth_connected') {
      toast.success(t('oauth.success'));
      // Clean URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      let errorMessage = t('oauth.callbackFailed');
      switch (error) {
        case 'oauth_failed':
          errorMessage = `${t('oauth.failed')}: ${details || t('oauth.unknownError')}`;
          break;
        case 'no_code':
          errorMessage = t('oauth.noCode');
          break;
        case 'token_exchange_failed':
          errorMessage = t('oauth.tokenFailed');
          break;
        case 'callback_failed':
          errorMessage = t('oauth.callbackFailed');
          break;
      }
      toast.error(errorMessage);
      // Clean URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [t]);

  const integrationTabs = [
    {
      id: 'dashboard',
      name: t('integrations.tabs.dashboard'),
      description: t('integrations.tabs.dashboardDesc'),
      icon: <HiOutlineChartBar className="w-6 h-6" />,
      color: 'blue',
      component: <SalesforceDashboard />
    },
    {
      id: 'salesforce',
      name: t('integrations.tabs.salesforce'),
      description: t('integrations.tabs.salesforceDesc'),
      icon: <HiOutlineCloud className="w-6 h-6" />,
      color: 'indigo',
      component: <SalesforceIntegration />
    },
    {
      id: 'api-tokens',
      name: t('integrations.tabs.apiConfig'),
      description: t('integrations.tabs.apiConfigDesc'),
      icon: <HiOutlineCog className="w-6 h-6" />,
      color: 'gray',
      component: <APITokensTab />
    },
    {
      id: 'security',
      name: t('integrations.tabs.security'),
      description: t('integrations.tabs.securityDesc'),
      icon: <HiOutlineShieldCheck className="w-6 h-6" />,
      color: 'green',
      component: <SecurityTab />
    },
    {
      id: 'help',
      name: t('integrations.tabs.help'),
      description: t('integrations.tabs.helpDesc'),
      icon: <HiOutlineQuestionMarkCircle className="w-6 h-6" />,
      color: 'yellow',
      component: <HelpTab />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header mejorado con botón de retorno */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Botón de retorno y título */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Botón de retorno al admin panel */}
              <button
                onClick={() => navigate('/admin')}
                className="group flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">{t('admin.back')}</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <HiOutlineCloud className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                    {t('integrations.title')}
                  </h1>
                  <p className="text-blue-100 mt-2 text-lg">
                    {t('integrations.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats mejoradas con más espacio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/90 rounded-xl shadow-lg">
                  <HiOutlineChartBar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 font-medium">{t('integrations.connectionStatus')}</p>
                  <p className="text-xl font-bold text-white">{t('integrations.connected')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/90 rounded-xl shadow-lg">
                  <FaLightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 font-medium">{t('integrations.lastSync')}</p>
                  <p className="text-xl font-bold text-white">2 {t('integrations.minutes')} {t('integrations.ago')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/90 rounded-xl shadow-lg">
                  <FaChartLine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 font-medium">{t('integrations.syncedRecords')}</p>
                  <p className="text-xl font-bold text-white">1,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal con más espacio y mejor organización */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Navegación con tarjetas mejoradas y más espaciadas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Selecciona una sección para gestionar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">
            {integrationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 text-left transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 shadow-xl scale-105 ring-4 ring-${tab.color}-200`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl hover:-translate-y-2'
                }`}
              >
                <div className={`inline-flex p-4 rounded-xl mb-6 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-500 text-white shadow-lg` 
                    : `bg-gray-100 text-gray-600 group-hover:bg-${tab.color}-100 group-hover:text-${tab.color}-600 group-hover:scale-110`
                }`}>
                  {tab.icon}
                </div>
                <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${
                  activeTab === tab.id ? `text-${tab.color}-900` : 'text-gray-900'
                }`}>
                  {tab.name}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  activeTab === tab.id ? `text-${tab.color}-700` : 'text-gray-600'
                }`}>
                  {tab.description}
                </p>
                
                {/* Indicador activo mejorado */}
                {activeTab === tab.id && (
                  <div className={`absolute top-4 right-4 w-4 h-4 bg-${tab.color}-500 rounded-full animate-pulse shadow-lg`}>
                    <div className={`absolute inset-0 w-4 h-4 bg-${tab.color}-400 rounded-full animate-ping`}></div>
                  </div>
                )}
                
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%]"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel de contenido con diseño mejorado */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          {/* Header del panel activo */}
          <div className={`bg-gradient-to-r from-${integrationTabs.find(tab => tab.id === activeTab)?.color}-500 to-${integrationTabs.find(tab => tab.id === activeTab)?.color}-600 text-white p-8`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                {integrationTabs.find(tab => tab.id === activeTab)?.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {integrationTabs.find(tab => tab.id === activeTab)?.name}
                </h2>
                <p className="text-white/90 mt-1">
                  {integrationTabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Contenido del panel con más padding */}
          <div className="p-12">
            <div className="transition-all duration-700 ease-in-out transform">
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
  const [config, setConfig] = useState({
    clientId: '',
    clientSecret: '',
    instanceUrl: 'https://login.salesforce.com',
    redirectUri: ''
  });
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would save the configuration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success(t('apiConfig.testSuccess'));
    } catch (error) {
      toast.error(t('apiConfig.testFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/salesforce/debug/config');
      if (response.ok) {
        toast.success(t('apiConfig.testSuccess'));
      } else {
        toast.error(t('apiConfig.testFailed'));
      }
    } catch (error) {
      toast.error(t('apiConfig.testFailed'));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t('apiConfig.title')}
        </h3>
        <p className="text-gray-600">
          {t('apiConfig.description')}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('apiConfig.clientId')}
              </label>
              <input
                type="text"
                value={config.clientId}
                onChange={(e) => setConfig({...config, clientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3MVG9d..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('apiConfig.clientSecret')}
              </label>
              <input
                type="password"
                value={config.clientSecret}
                onChange={(e) => setConfig({...config, clientSecret: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('apiConfig.instanceUrl')}
              </label>
              <input
                type="url"
                value={config.instanceUrl}
                onChange={(e) => setConfig({...config, instanceUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('apiConfig.redirectUri')}
              </label>
              <input
                type="url"
                value={config.redirectUri}
                onChange={(e) => setConfig({...config, redirectUri: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-app.com/callback"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('apiConfig.connectionTest')}...
                </>
              ) : (
                <>
                  <FaCog className="w-4 h-4 mr-2" />
                  {t('apiConfig.testConnection')}
                </>
              )}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaCloud className="w-4 h-4 mr-2" />
                  {t('apiConfig.saveSettings')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityTab = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    adminOnly: true,
    encryptData: true,
    enableAudit: false,
    sessionTimeout: 30
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would save the security settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Configuración de seguridad guardada');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t('security.title')}
        </h3>
        <p className="text-gray-600">
          {t('security.description')}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {t('security.permissions')}
            </h4>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.adminOnly}
                  onChange={(e) => setSettings({...settings, adminOnly: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm">
                  <span className="font-medium text-gray-900">{t('security.adminOnly')}</span>
                  <span className="text-gray-500 block">Solo administradores pueden acceder a la integración</span>
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!settings.adminOnly}
                  onChange={(e) => setSettings({...settings, adminOnly: !e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm">
                  <span className="font-medium text-gray-900">{t('security.userAccess')}</span>
                  <span className="text-gray-500 block">Permitir acceso a usuarios regulares</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Configuración de Datos</h4>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.encryptData}
                  onChange={(e) => setSettings({...settings, encryptData: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm">
                  <span className="font-medium text-gray-900">{t('security.encryptData')}</span>
                  <span className="text-gray-500 block">Cifrar todos los datos en tránsito</span>
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enableAudit}
                  onChange={(e) => setSettings({...settings, enableAudit: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm">
                  <span className="font-medium text-gray-900">{t('security.enableAudit')}</span>
                  <span className="text-gray-500 block">Registrar todas las acciones de la integración</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('security.sessionTimeout')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="120"
              />
              <span className="text-sm text-gray-600">{t('security.minutes')}</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaShieldAlt className="w-4 h-4 mr-2" />
                  {t('security.saveSettings')}
                </>
              )}
            </button>
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
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t('help.title')}
        </h3>
        <p className="text-gray-600">
          {t('help.description')}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FaCode className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">{t('help.setupGuide')}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('help.setupDesc')}</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Crear Connected App en Salesforce</p>
            <p>• Configurar OAuth con callback URL</p>
            <p>• Copiar Consumer Key y Secret</p>
            <p>• Probar la conexión</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <FaQuestionCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900">{t('help.troubleshooting')}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('help.troubleshootDesc')}</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Error de conexión:</strong> Verificar credenciales</p>
            <p><strong>Error OAuth:</strong> Revisar callback URL</p>
            <p><strong>Límites API:</strong> Verificar cuotas de Salesforce</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <FaCode className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">{t('help.apiDocs')}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('help.apiDocsDesc')}</p>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver documentación →
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <FaQuestionCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">{t('help.support')}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('help.supportDesc')}</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors">
            Contactar soporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrationsPage;
