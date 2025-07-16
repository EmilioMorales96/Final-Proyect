import { useState } from 'react';
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
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Real Estate', 'Consulting', 'Other'
  ];

  const employeeRanges = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
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
        toast.success('¡Cuenta creada exitosamente en Salesforce!');
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
        toast.error(data.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('Salesforce integration error:', error);
      toast.error('Error de conexión con Salesforce');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con información */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
          <FiCloud className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Integración Manual con Salesforce
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Crea cuentas y contactos directamente en Salesforce desde tu formulario. 
          Perfecta para leads importantes que requieren atención inmediata.
        </p>
      </div>

      {/* Tarjetas de funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex p-3 bg-blue-100 rounded-lg mb-4">
            <HiOutlineOfficeBuilding className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Crear Cuentas</h3>
          <p className="text-sm text-gray-600">
            Agrega nuevas empresas y organizaciones directamente a tu CRM
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex p-3 bg-purple-100 rounded-lg mb-4">
            <HiOutlineUserGroup className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Gestionar Contactos</h3>
          <p className="text-sm text-gray-600">
            Crea y actualiza información de contactos en tiempo real
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex p-3 bg-green-100 rounded-lg mb-4">
            <FiCheck className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Validación Automática</h3>
          <p className="text-sm text-gray-600">
            Verifica datos y evita duplicados automáticamente
          </p>
        </div>
      </div>

      {/* Botón principal mejorado */}
      <div className="text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Crear Cuenta en Salesforce</span>
          <FiSend className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Modal mejorado */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-8 max-w-2xl mx-auto">
          {/* Header del modal */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
              <FiCloud className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nueva Cuenta en Salesforce
            </h2>
            <p className="text-gray-600">
              Completa la información para crear una nueva cuenta empresarial
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <HiOutlineOfficeBuilding className="w-5 h-5 mr-2" />
                Información de la Empresa
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ej: Acme Corporation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industria
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Seleccionar industria</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <HiOutlinePhone className="w-5 h-5 mr-2" />
                Información de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Información empresarial */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="w-5 h-5 mr-2" />
                Datos Empresariales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Empleados
                  </label>
                  <select
                    name="numberOfEmployees"
                    value={formData.numberOfEmployees}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Seleccionar rango</option>
                    {employeeRanges.map(range => (
                      <option key={range} value={range}>{range} empleados</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingresos Anuales (USD)
                  </label>
                  <input
                    type="number"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="100000"
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.company}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Crear Cuenta</span>
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
