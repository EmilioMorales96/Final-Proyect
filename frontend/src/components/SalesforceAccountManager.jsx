import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiDatabase,
  FiRefreshCw,
  FiExternalLink,
  FiCheckCircle,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrash2
} from 'react-icons/fi';
import { 
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlinePhone
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const SalesforceAccountManager = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortBy, setSortBy] = useState('created_date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchAccounts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error(t('dashboard.salesforce.loginRequired'));
        return;
      }

      const response = await fetch(`${API_URL}/api/salesforce/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error fetching accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Network error while fetching accounts');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedAccounts = accounts
    .filter(account => {
      const matchesSearch = account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.industry?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = !selectedIndustry || account.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const uniqueIndustries = [...new Set(accounts.map(account => account.industry).filter(Boolean))];

  const exportAccounts = () => {
    const csv = [
      ['Name', 'Industry', 'Phone', 'Website', 'Employees', 'Revenue', 'Created Date'],
      ...filteredAndSortedAccounts.map(account => [
        account.name,
        account.industry || '',
        account.phone || '',
        account.website || '',
        account.employees || '',
        account.revenue || '',
        account.created_date ? new Date(account.created_date).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salesforce-accounts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Accounts exported successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FiDatabase className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Account Manager</h2>
              <p className="text-blue-100 mt-1">
                Manage and view all your Salesforce accounts
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{accounts.length}</div>
              <div className="text-blue-100 text-sm">Total Accounts</div>
            </div>
            <button
              onClick={fetchAccounts}
              disabled={loading}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Industry Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {uniqueIndustries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_date-desc">Newest First</option>
              <option value="created_date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>

            {/* Export */}
            <button
              onClick={exportAccounts}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3 text-gray-600 dark:text-gray-400">
              <FiRefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading accounts...</span>
            </div>
          </div>
        ) : filteredAndSortedAccounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6">
              <FiDatabase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {searchTerm || selectedIndustry ? 'No accounts found' : 'No accounts created yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              {searchTerm || selectedIndustry 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first Salesforce account to get started'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedAccounts.map((account) => (
              <div 
                key={account.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <HiOutlineOfficeBuilding className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {account.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                        <span>ID: {account.id}</span>
                        {account.industry && (
                          <span>• {account.industry}</span>
                        )}
                      </div>
                      {account.created_date && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Created: {new Date(account.created_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      <span>View in Salesforce</span>
                    </a>
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <FiCheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Synced</span>
                    </div>
                  </div>
                </div>
                
                {/* Account Details */}
                {(account.phone || account.website || account.employees || account.revenue) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {account.phone && (
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <HiOutlinePhone className="w-4 h-4" />
                          <span>{account.phone}</span>
                        </div>
                      )}
                      {account.website && (
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <FiExternalLink className="w-4 h-4" />
                          <a href={account.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                            {account.website}
                          </a>
                        </div>
                      )}
                      {account.employees && (
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <HiOutlineUserGroup className="w-4 h-4" />
                          <span>{account.employees} employees</span>
                        </div>
                      )}
                      {account.revenue && (
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Revenue:</span>
                          <span>${account.revenue.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesforceAccountManager;
