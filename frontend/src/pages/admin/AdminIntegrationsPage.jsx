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
import FormInput from '../../components/forms/FormInput';
import FormButton from '../../components/forms/FormButton';
import FormCard from '../../components/forms/FormCard';
import FormCheckbox from '../../components/forms/FormCheckbox';
import HelpCard from '../../components/forms/HelpCard';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header mejorado con botón de retorno y dark mode */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Botón de retorno y título */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Botón de retorno al admin panel */}
              <button
                onClick={() => navigate('/admin')}
                className="group flex items-center space-x-3 bg-white/10 hover:bg-white/20 dark:bg-gray-600/30 dark:hover:bg-gray-600/50 backdrop-blur-sm rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">{t('admin.back')}</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 dark:bg-gray-600/30 rounded-xl backdrop-blur-sm shadow-lg">
                  <HiOutlineCloud className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 dark:from-gray-100 dark:to-gray-300 bg-clip-text">
                    {t('integrations.title')}
                  </h1>
                  <p className="text-blue-100 dark:text-gray-300 mt-2 text-lg">
                    {t('integrations.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats mejoradas con más espacio y dark mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/15 dark:bg-gray-700/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-gray-600/30">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/90 dark:bg-green-600/90 rounded-xl shadow-lg">
                  <HiOutlineChartBar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 dark:text-gray-300 font-medium">{t('integrations.connectionStatus')}</p>
                  <p className="text-xl font-bold text-white dark:text-gray-100">{t('integrations.connected')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/15 dark:bg-gray-700/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-gray-600/30">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/90 dark:bg-purple-600/90 rounded-xl shadow-lg">
                  <FaLightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 dark:text-gray-300 font-medium">{t('integrations.lastSync')}</p>
                  <p className="text-xl font-bold text-white dark:text-gray-100">2 {t('integrations.minutes')} {t('integrations.ago')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/15 dark:bg-gray-700/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 dark:border-gray-600/30">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/90 dark:bg-orange-600/90 rounded-xl shadow-lg">
                  <FaChartLine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 dark:text-gray-300 font-medium">{t('integrations.syncedRecords')}</p>
                  <p className="text-xl font-bold text-white dark:text-gray-100">1,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal con más espacio y mejor organización */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Navegación con tarjetas mejoradas y más espaciadas con dark mode */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Selecciona una sección para gestionar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">
            {integrationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 text-left transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 dark:from-${tab.color}-900/30 dark:to-${tab.color}-800/30 shadow-xl scale-105 ring-4 ring-${tab.color}-200 dark:ring-${tab.color}-700/50`
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl hover:-translate-y-2'
                }`}
              >
                <div className={`inline-flex p-4 rounded-xl mb-6 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-500 dark:bg-${tab.color}-600 text-white shadow-lg` 
                    : `bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-${tab.color}-100 dark:group-hover:bg-${tab.color}-900/30 group-hover:text-${tab.color}-600 dark:group-hover:text-${tab.color}-400 group-hover:scale-110`
                }`}>
                  {tab.icon}
                </div>
                <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${
                  activeTab === tab.id ? `text-${tab.color}-900 dark:text-${tab.color}-200` : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {tab.name}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  activeTab === tab.id ? `text-${tab.color}-700 dark:text-${tab.color}-300` : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {tab.description}
                </p>
                
                {/* Indicador activo mejorado */}
                {activeTab === tab.id && (
                  <div className={`absolute top-4 right-4 w-4 h-4 bg-${tab.color}-500 dark:bg-${tab.color}-400 rounded-full animate-pulse shadow-lg`}>
                    <div className={`absolute inset-0 w-4 h-4 bg-${tab.color}-400 dark:bg-${tab.color}-300 rounded-full animate-ping`}></div>
                  </div>
                )}
                
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 dark:via-gray-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%]"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel de contenido con diseño mejorado y dark mode */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          {/* Header del panel activo */}
          <div className={`bg-gradient-to-r from-${integrationTabs.find(tab => tab.id === activeTab)?.color}-500 to-${integrationTabs.find(tab => tab.id === activeTab)?.color}-600 dark:from-${integrationTabs.find(tab => tab.id === activeTab)?.color}-600 dark:to-${integrationTabs.find(tab => tab.id === activeTab)?.color}-700 text-white p-8`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
                {integrationTabs.find(tab => tab.id === activeTab)?.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {integrationTabs.find(tab => tab.id === activeTab)?.name}
                </h2>
                <p className="text-white/90 dark:text-gray-200 mt-1">
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
      <FormCard
        title={t('apiConfig.title')}
        subtitle={t('apiConfig.description')}
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label={t('apiConfig.clientId')}
              value={config.clientId}
              onChange={(e) => setConfig({...config, clientId: e.target.value})}
              placeholder="3MVG9d..."
            />
            
            <FormInput
              label={t('apiConfig.clientSecret')}
              type="password"
              value={config.clientSecret}
              onChange={(e) => setConfig({...config, clientSecret: e.target.value})}
              placeholder="••••••••"
            />
            
            <FormInput
              label={t('apiConfig.instanceUrl')}
              type="url"
              value={config.instanceUrl}
              onChange={(e) => setConfig({...config, instanceUrl: e.target.value})}
            />
            
            <FormInput
              label={t('apiConfig.redirectUri')}
              type="url"
              value={config.redirectUri}
              onChange={(e) => setConfig({...config, redirectUri: e.target.value})}
              placeholder="https://your-app.com/callback"
            />
          </div>
          
          <div className="flex space-x-4">
            <FormButton
              variant="primary"
              icon={FaCog}
              onClick={handleTest}
              loading={testing}
              disabled={testing}
            >
              {testing ? `${t('apiConfig.connectionTest')}...` : t('apiConfig.testConnection')}
            </FormButton>
            
            <FormButton
              variant="success"
              icon={FaCloud}
              onClick={handleSave}
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Guardando...' : t('apiConfig.saveSettings')}
            </FormButton>
          </div>
        </div>
      </FormCard>
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
      <FormCard
        title={t('security.title')}
        subtitle={t('security.description')}
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {t('security.permissions')}
            </h4>
            <div className="space-y-4">
              <FormCheckbox
                label={t('security.adminOnly')}
                description="Solo administradores pueden acceder a la integración"
                checked={settings.adminOnly}
                onChange={(e) => setSettings({...settings, adminOnly: e.target.checked})}
              />
              
              <FormCheckbox
                label={t('security.userAccess')}
                description="Permitir acceso a usuarios regulares"
                checked={!settings.adminOnly}
                onChange={(e) => setSettings({...settings, adminOnly: !e.target.checked})}
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Configuración de Datos
            </h4>
            <div className="space-y-4">
              <FormCheckbox
                label={t('security.encryptData')}
                description="Cifrar todos los datos en tránsito"
                checked={settings.encryptData}
                onChange={(e) => setSettings({...settings, encryptData: e.target.checked})}
              />
              
              <FormCheckbox
                label={t('security.enableAudit')}
                description="Registrar todas las acciones de la integración"
                checked={settings.enableAudit}
                onChange={(e) => setSettings({...settings, enableAudit: e.target.checked})}
              />
            </div>
          </div>

          <FormInput
            label={t('security.sessionTimeout')}
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
            min="5"
            max="120"
            className="max-w-xs"
          />

          <div className="pt-4">
            <FormButton
              variant="success"
              icon={FaShieldAlt}
              onClick={handleSave}
              loading={saving}
              disabled={saving}
              size="lg"
            >
              {saving ? 'Guardando...' : t('security.saveSettings')}
            </FormButton>
          </div>
        </div>
      </FormCard>
    </div>
  );
};

const HelpTab = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <FormCard
        title={t('help.title')}
        subtitle={t('help.description')}
        bodyClassName="p-0"
      >
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <HelpCard
            title={t('help.setupGuide')}
            description={t('help.setupDesc')}
            icon={FaCode}
            iconColor="blue"
            buttonText="Ver documentación →"
            onButtonClick={() => {}}
          >
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>• Crear Connected App en Salesforce</p>
              <p>• Configurar OAuth con callback URL</p>
              <p>• Copiar Consumer Key y Secret</p>
              <p>• Probar la conexión</p>
            </div>
          </HelpCard>
          
          <HelpCard
            title={t('help.troubleshooting')}
            description={t('help.troubleshootDesc')}
            icon={FaQuestionCircle}
            iconColor="yellow"
          >
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Error de conexión:</strong> Verificar credenciales</p>
              <p><strong>Error OAuth:</strong> Revisar callback URL</p>
              <p><strong>Límites API:</strong> Verificar cuotas de Salesforce</p>
            </div>
          </HelpCard>
          
          <HelpCard
            title={t('help.apiDocs')}
            description={t('help.apiDocsDesc')}
            icon={FaCode}
            iconColor="green"
            buttonText="Ver documentación →"
            onButtonClick={() => {}}
          />
          
          <HelpCard
            title={t('help.support')}
            description={t('help.supportDesc')}
            icon={FaQuestionCircle}
            iconColor="purple"
            buttonText="Contactar soporte"
            onButtonClick={() => {}}
          />
        </div>
      </FormCard>
    </div>
  );
};

export default AdminIntegrationsPage;
