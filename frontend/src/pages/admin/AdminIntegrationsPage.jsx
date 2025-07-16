import { Link } from "react-router-dom";
import { SalesforceIntegration } from "../../components/SalesforceIntegration";
import SalesforceDashboard from "../../components/SalesforceDashboard";
import ApiTokenManager from "../../components/ApiTokenManager";

/**
 * AdminIntegrationsPage - Admin page for managing external integrations
 * Contains Salesforce integration and API token management
 * Only accessible by admin users
 */
export default function AdminIntegrationsPage() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            ← Back to Admin Panel
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  System Integrations
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage external integrations and API access for the platform
                </p>
              </div>
            </div>
            
            {/* Admin Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Administrator Access Only</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    These integrations affect the entire platform. Changes here impact all users and should be made carefully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="space-y-8">
          {/* Salesforce Dashboard */}
          <SalesforceDashboard />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Manual Salesforce Integration */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Manual Account Creation</h3>
                    <p className="text-blue-100 text-sm">Create individual Salesforce accounts</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <SalesforceIntegration />
              </div>
            </div>

          {/* API Token Manager */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">API Token Management</h3>
                  <p className="text-purple-100 text-sm">Manage API access tokens</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ApiTokenManager />
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Integration Help
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔗 Salesforce Integration</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Connect to Salesforce to sync form responses</li>
                <li>Automatically create leads from form submissions</li>
                <li>Requires valid Salesforce credentials</li>
                <li>Test connection before saving changes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔑 API Token Management</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Generate tokens for external API access</li>
                <li>Control access permissions and scopes</li>
                <li>Monitor token usage and activity</li>
                <li>Revoke tokens when necessary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
