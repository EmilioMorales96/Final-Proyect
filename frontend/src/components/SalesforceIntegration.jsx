import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiCloud, 
  FiPlus,
  FiSend,
  FiCheck,
  FiUsers
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
  const [formData, setFormData] = useState({
    company: '',
    phone: '',
    website: '',
    industry: '',
    annualRevenue: '',
    numberOfEmployees: ''
  });

  const industries = [
    { key: 'technology', label: t('industry.technology') },
    { key: 'healthcare', label: t('industry.healthcare') },
    { key: 'finance', label: t('industry.finance') },
    { key: 'education', label: t('industry.education') },
    { key: 'manufacturing', label: t('industry.manufacturing') },
    { key: 'retail', label: t('industry.retail') },
    { key: 'realEstate', label: t('industry.realEstate') },
    { key: 'consulting', label: t('industry.consulting') },
    { key: 'other', label: t('industry.other') }
  ];

  const employeeRanges = [
    { key: '1-10', label: t('employees.1-10') },
    { key: '11-50', label: t('employees.11-50') },
    { key: '51-200', label: t('employees.51-200') },
    { key: '201-500', label: t('employees.201-500') },
    { key: '501-1000', label: t('employees.501-1000') },
    { key: '1000+', label: t('employees.1000+') }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/salesforce/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('integration.manual.success'));
        setIsOpen(false);
        setFormData({
          company: '',
          phone: '',
          website: '',
          industry: '',
          annualRevenue: '',
          numberOfEmployees: ''
        });
      } else {
        toast.error(data.message || t('integration.manual.error'));
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
      {/* Header con información - Más espaciado */}
      <div className="text-center py-8">
        <div className="inline-flex p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-8 shadow-lg">
          <FiCloud className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {t('integration.manual.title')}
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          {t('integration.manual.subtitle')}
        </p>
      </div>

      {/* Tarjetas de funcionalidades - Con más espacio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 text-center hover:shadow-2xl hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-2">
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <HiOutlineOfficeBuilding className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-4">{t('integration.manual.features.createAccounts.title')}</h3>
          <p className="text-gray-600 leading-relaxed">
            {t('integration.manual.features.createAccounts.description')}
          </p>
        </div>

        <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 text-center hover:shadow-2xl hover:border-purple-200 transition-all duration-500 transform hover:-translate-y-2">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <HiOutlineUserGroup className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-4">{t('integration.manual.features.manageContacts.title')}</h3>
          <p className="text-gray-600 leading-relaxed">
            {t('integration.manual.features.manageContacts.description')}
          </p>
        </div>

        <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 text-center hover:shadow-2xl hover:border-green-200 transition-all duration-500 transform hover:-translate-y-2">
          <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-4">{t('integration.manual.features.autoValidation.title')}</h3>
          <p className="text-gray-600 leading-relaxed">
            {t('integration.manual.features.autoValidation.description')}
          </p>
        </div>
      </div>

      {/* Botón principal mejorado con animaciones y efectos avanzados */}
      <div className="text-center py-12">
        <div className="relative inline-block">
          {/* Glow effect background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative group inline-flex items-center justify-center space-x-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-12 py-6 rounded-xl font-bold text-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
            
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
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-700 delay-100"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-blue-200/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-700 delay-200"></div>
              <div className="absolute bottom-3 left-8 w-1 h-1 bg-purple-200/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-700 delay-300"></div>
            </div>
          </button>
        </div>
        
        {/* Tooltip mejorado */}
        <div className="mt-8 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <p className="text-gray-500 max-w-md mx-auto text-lg">
            💡 {t('integration.manual.subtitle')}
          </p>
        </div>
      </div>

      {/* Modal mejorado con mejor espaciado */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-10 max-w-4xl mx-auto">
          {/* Header del modal mejorado */}
          <div className="text-center mb-10">
            <div className="inline-flex p-5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg">
              <FiCloud className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('integration.manual.modal.title')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('integration.manual.modal.subtitle')}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Información básica con mejor espaciado */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-blue-500 rounded-xl mr-4">
                  <HiOutlineOfficeBuilding className="w-6 h-6 text-white" />
                </div>
                {t('integration.manual.sections.companyInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('integration.manual.form.companyName')} *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder={t('integration.manual.form.companyNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('integration.manual.form.industry')}
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('integration.manual.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg"
                    placeholder={t('integration.manual.form.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('integration.manual.form.website')}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg"
                    placeholder={t('integration.manual.form.websitePlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Información empresarial con mejor espaciado */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-green-500 rounded-xl mr-4">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                {t('integration.manual.sections.businessData')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('integration.manual.form.employees')}
                  </label>
                  <select
                    name="numberOfEmployees"
                    value={formData.numberOfEmployees}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg"
                  >
                    <option value="">{t('integration.manual.form.selectEmployees')}</option>
                    {employeeRanges.map(range => (
                      <option key={range.key} value={range.key}>{range.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('integration.manual.form.annualRevenue')}
                  </label>
                  <input
                    type="number"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg"
                    placeholder={t('integration.manual.form.annualRevenuePlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción mejorados */}
            <div className="flex items-center justify-end space-x-6 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-lg"
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
