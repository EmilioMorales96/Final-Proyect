import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiCloud, 
  FiPlus,
  FiSend,
  FiCheck,
  FiUsers,
  FiDatabase,
  FiExternalLink,
  FiRefreshCw,
  FiXCircle,
  FiCheckCircle,
  FiLink,
  FiTrendingUp
} from 'react-icons/fi';
import { 
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlinePhone
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { Modal } from './Modal';

const API_URL = import.meta.env.VITE_API_URL;

const SalesforceIntegration = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdAccounts, setCreatedAccounts] = useState([]);
  const [showAccountsPanel, setShowAccountsPanel] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    company: '',
    phone: '',
    website: '',
    industry: '',
    annualRevenue: '',
    numberOfEmployees: ''
  });

  // Fetch created accounts on component mount
  useEffect(() => {
    fetchCreatedAccounts();
  }, []);

  const fetchCreatedAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/salesforce/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };


  // Industry options (real, no demo)
  const industries = [
    { key: 'technology', label: t('industry.technology') },
    { key: 'healthcare', label: t('industry.healthcare') },
    { key: 'finance', label: t('industry.finance') },
    { key: 'education', label: t('industry.education') },
    { key: 'manufacturing', label: t('industry.manufacturing') },
    { key: 'retail', label: t('industry.retail') },
    { key: 'construction', label: t('industry.construction') },
    { key: 'agriculture', label: t('industry.agriculture') },
    { key: 'other', label: t('industry.other') }
  ];


  // Employee ranges (real, no demo)
  const employeeRanges = [
    { key: '1-9', label: t('employees.1-9') },
    { key: '10-49', label: t('employees.10-49') },
    { key: '50-99', label: t('employees.50-99') },
    { key: '100-249', label: t('employees.100-249') },
    { key: '250-499', label: t('employees.250-499') },
    { key: '500-999', label: t('employees.500-999') },
    { key: '1000+', label: t('employees.1000+') }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.company.trim()) {
      errors.company = t('integration.manual.validation.companyRequired');
    } else if (formData.company.length < 2) {
      errors.company = t('integration.manual.validation.companyTooShort');
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = t('integration.manual.validation.phoneInvalid');
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errors.website = t('integration.manual.validation.websiteInvalid');
    }

    if (formData.annualRevenue && (isNaN(formData.annualRevenue) || Number(formData.annualRevenue) < 0)) {
      errors.annualRevenue = t('integration.manual.validation.revenueInvalid');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error(t('integration.manual.validation.formHasErrors'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/salesforce/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message for REAL integration only
        toast.success(
          `✅ REAL SALESFORCE: Account "${data.salesforce.account.name}" created!\n` +
          `🎯 Account ID: ${data.salesforce.account.id}\n` +
          `🔗 View in Salesforce: ${data.salesforce.account.url}`,
          { 
            duration: 10000,
            style: {
              background: '#d1fae5',
              color: '#065f46',
              border: '1px solid #10b981'
            }
          }
        );
        
        setIsOpen(false);
        setFormData({
          company: '',
          phone: '',
          website: '',
          industry: '',
          annualRevenue: '',
          numberOfEmployees: ''
        });
        
        // Refresh accounts list
        fetchCreatedAccounts();
        
        // Show additional info in console for demo purposes
        console.log('🏢 REAL Salesforce Integration Result:', data);
      } else {
        // Show error with setup instructions if Salesforce is not configured
        if (data.setup_required) {
          toast.error(
            `❌ Salesforce Setup Required\n` +
            `Please configure your Salesforce Connected App\n` +
            `Check SALESFORCE_CONFIGURATION_GUIDE.md`,
            { 
              duration: 8000,
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #f87171'
              }
            }
          );
        } else {
          toast.error(data.message || t('integration.manual.error'));
        }
      }
    } catch (error) {
      console.error('Salesforce integration error:', error);
      toast.error(t('integration.manual.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header con información - Más espaciado con dark mode */}
      <div className="text-center py-8">
        <div className="inline-flex p-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-8 shadow-lg">
          <FiCloud className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('integration.manual.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          {t('integration.manual.subtitle')}
        </p>
      </div>


      {/* Tarjetas de funcionalidades - Solo información real, sin demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-8 text-center hover:shadow-2xl dark:hover:shadow-gray-900/50 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-500 transform hover:-translate-y-2">
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <HiOutlineOfficeBuilding className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">{t('integration.real.features.createAccounts.title', 'Create Accounts')}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('integration.real.features.createAccounts.description', 'Create new accounts in Salesforce directly from your application.')}
          </p>
        </div>

        <div className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-8 text-center hover:shadow-2xl dark:hover:shadow-gray-900/50 hover:border-purple-200 dark:hover:border-purple-600 transition-all duration-500 transform hover:-translate-y-2">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <HiOutlineUserGroup className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">{t('integration.real.features.manageContacts.title', 'Manage Contacts')}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('integration.real.features.manageContacts.description', 'Easily manage and sync contacts with Salesforce CRM.')}
          </p>
        </div>

        <div className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-8 text-center hover:shadow-2xl dark:hover:shadow-gray-900/50 hover:border-green-200 dark:hover:border-green-600 transition-all duration-500 transform hover:-translate-y-2">
          <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">{t('integration.real.features.autoValidation.title', 'Automatic Validation')}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('integration.real.features.autoValidation.description', 'Automated validation of data and accounts for reliability.')}
          </p>
        </div>
      </div>

      {/* Enhanced Action Buttons Section */}
      <div className="flex justify-center space-x-6 py-8">
        {/* Create Account Button */}
        <div className="relative inline-block">
          {/* Glow effect background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative group bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-12 py-6 rounded-xl font-bold text-xl shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 hover:scale-105 transform transition-all duration-500 border-2 border-white/20 backdrop-blur-sm overflow-hidden"
          >
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Icons and text with independent animations */}
            <div className="relative flex items-center space-x-4">
              <div className="relative">
                <FiPlus className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                <div className="absolute inset-0 w-7 h-7 bg-white/20 rounded-full scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></div>
              </div>
              
              <span className="relative font-bold tracking-wide text-xl">
                {t('integration.manual.createButton')}
              </span>
              
              <div className="relative">
                <FiSend className="w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
              </div>
            </div>
          </button>
        </div>

        {/* View Accounts Button */}
        <button
          onClick={() => setShowAccountsPanel(!showAccountsPanel)}
          className="group bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white px-8 py-6 rounded-xl font-bold text-xl shadow-xl hover:shadow-green-500/50 dark:hover:shadow-green-400/30 hover:scale-105 transform transition-all duration-300 border-2 border-white/20 backdrop-blur-sm flex items-center space-x-3"
        >
          <FiDatabase className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          <span>{t('integration.manual.viewAccounts')} ({createdAccounts.length})</span>
          <FiExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Accounts Management Panel */}
      {showAccountsPanel && (
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <FiDatabase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('integration.manual.accountsPanel.title')}
                  </h3>
                  <p className="text-green-100">
                    {t('integration.manual.accountsPanel.subtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchCreatedAccounts}
                  className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors duration-200"
                >
                  <FiRefreshCw className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setShowAccountsPanel(false)}
                  className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors duration-200"
                >
                  <FiXCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {createdAccounts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6">
                  <FiDatabase className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {t('integration.manual.accountsPanel.noAccounts')}
                </h4>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  {t('integration.manual.accountsPanel.createFirst')}
                </p>
                <button
                  onClick={() => {
                    setShowAccountsPanel(false);
                    setIsOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  {t('integration.manual.createButton')}
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {createdAccounts.map((account, index) => (
                  <div 
                    key={account.id || index}
                    className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <HiOutlineOfficeBuilding className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {account.name || account.company}
                          </h5>
                          <p className="text-gray-600 dark:text-gray-400">
                            ID: {account.id} • {account.industry || t('integration.manual.noIndustry')}
                          </p>
                          {account.created_date && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {t('integration.manual.createdOn')}: {new Date(account.created_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {account.url && (
                          <a
                            href={account.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            <FiExternalLink className="w-4 h-4" />
                            <span>{t('integration.manual.viewInSalesforce')}</span>
                          </a>
                        )}
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <FiCheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{t('integration.manual.synced')}</span>
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
                              <FiLink className="w-4 h-4" />
                              <a href={account.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                                {account.website}
                              </a>
                            </div>
                          )}
                          {account.employees && (
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <HiOutlineUserGroup className="w-4 h-4" />
                              <span>{account.employees} {t('integration.manual.employees')}</span>
                            </div>
                          )}
                          {account.revenue && (
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                              <FiTrendingUp className="w-4 h-4" />
                              <span>${account.revenue}</span>
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
      )}

      {/* Modal mejorado con mejor espaciado y dark mode */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)} size="4xl">
        <div className="p-8 md:p-10">
          {/* Header del modal mejorado con dark mode */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-6 shadow-lg">
              <FiCloud className="w-10 h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('integration.manual.modal.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('integration.manual.modal.subtitle')}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información básica con mejor espaciado y dark mode */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-600">
              <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-xl mr-4">
                  <HiOutlineOfficeBuilding className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                {t('integration.manual.sections.companyInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('integration.manual.form.companyName')} *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 md:px-5 py-3 md:py-4 border-2 ${
                      formErrors.company 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 ${
                      formErrors.company 
                        ? 'focus:ring-red-500/20 dark:focus:ring-red-400/20 focus:border-red-500 dark:focus:border-red-400' 
                        : 'focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400'
                    } transition-all duration-300 text-base md:text-lg`}
                    placeholder={t('integration.manual.form.companyNamePlaceholder')}
                  />
                  {formErrors.company && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <FiXCircle className="w-4 h-4 mr-1" />
                      {formErrors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('integration.manual.form.industry')}
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-lg"
                  >
                    <option value="">{t('integration.manual.form.selectIndustry')}</option>
                    {industries.map(industry => (
                      <option key={industry.key} value={industry.key}>{industry.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Información de contacto con mejor espaciado */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-purple-500 rounded-xl mr-4">
                  <HiOutlinePhone className="w-6 h-6 text-white" />
                </div>
                {t('integration.manual.sections.contactInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('integration.manual.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 text-lg"
                    placeholder={t('integration.manual.form.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('integration.manual.form.website')}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 text-lg"
                    placeholder={t('integration.manual.form.websitePlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Información empresarial con mejor espaciado y dark mode */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600">
              <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <div className="p-2 bg-green-500 dark:bg-green-600 rounded-xl mr-4">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                {t('integration.manual.sections.businessData')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('integration.manual.form.employees')}
                  </label>
                  <select
                    name="numberOfEmployees"
                    value={formData.numberOfEmployees}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:border-green-500 dark:focus:border-green-400 transition-all duration-300 text-lg"
                  >
                    <option value="">{t('integration.manual.form.selectEmployees')}</option>
                    {employeeRanges.map(range => (
                      <option key={range.key} value={range.key}>{range.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('integration.manual.form.annualRevenue')}
                  </label>
                  <input
                    type="number"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:border-green-500 dark:focus:border-green-400 transition-all duration-300 text-lg"
                    placeholder={t('integration.manual.form.annualRevenuePlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción mejorados con dark mode */}
            <div className="flex items-center justify-end space-x-6 pt-8 border-t-2 border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 font-semibold text-lg"
              >
                {t('integration.manual.buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || !formData.company}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('integration.manual.buttons.creating')}</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>{t('integration.manual.buttons.create')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SalesforceIntegration;
