import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCode, FaCloud, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import SalesforceIntegration from '../../components/SalesforceIntegration';
import SalesforceDashboard from '../../components/SalesforceDashboard';

const AdminIntegrationsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const integrationTabs = [
    {
      id: 'dashboard',
      name: t('admin.integrations.dashboard'),
      icon: <FaCloud className="w-5 h-5" />,
      component: <SalesforceDashboard />
    },
    {
      id: 'salesforce',
      name: t('admin.integrations.salesforce'),
      icon: <FaCloud className="w-5 h-5" />,
      component: <SalesforceIntegration />
    },
    {
      id: 'api-tokens',
      name: t('admin.integrations.apiTokens'),
      icon: <FaCode className="w-5 h-5" />,
      component: <APITokensTab />
    },
    {
      id: 'security',
      name: t('admin.integrations.security'),
      icon: <FaShieldAlt className="w-5 h-5" />,
      component: <SecurityTab />
    },
    {
      id: 'help',
      name: t('admin.integrations.help'),
      icon: <FaQuestionCircle className="w-5 h-5" />,
      component: <HelpTab />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.integrations.title')}
          </h1>
          <p className="text-gray-600">
            {t('admin.integrations.description')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {integrationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {integrationTabs.find(tab => tab.id === activeTab)?.component}
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
