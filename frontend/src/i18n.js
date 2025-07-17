import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

/**
 * Internationalization configuration for the Forms application
 * Supports English and Spanish languages
 * Uses browser language detection and local storage persistence
 */

// Translation resources for multiple languages
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.forms": "Forms", 
      "nav.login": "Login",
      "nav.register": "Register",
      "nav.search.placeholder": "Search templates, questions, comments...",
      
      // Dashboard
      "dashboard.title": "Forms Dashboard",
      "dashboard.subtitle": "Create, manage, and analyze your forms with powerful tools and insights",
      "dashboard.stats.total": "Total Templates",
      "dashboard.stats.favorites": "Favorites",
      "dashboard.stats.trending": "Trending",
      "dashboard.my_templates": "My Templates",
      "dashboard.manage_organize": "Manage and organize your form templates",
      "dashboard.create_template": "Create Template",
      "dashboard.no_templates": "No templates yet",
      "dashboard.no_templates_desc": "Get started by creating your first form template to collect responses from users.",
      "dashboard.create_first": "Create Your First Template",
      "dashboard.show_favorites": "Show Only Favorites",
      "dashboard.show_all": "Show All Templates",
      "dashboard.filtering_by": "Filtering by:",
      "dashboard.no_templates_tag": "No templates found for this tag",
      "dashboard.no_templates_tag_desc": "Try selecting a different tag or clear the filter to see all templates.",
      
      // Template Actions
      "template.public": "Public",
      "template.private": "Private", 
      "template.trending": "Trending",
      "template.fill_form": "Fill Form",
      "template.edit": "Edit",
      "template.answers": "Answers",
      "template.delete": "Delete",
      "template.created_by": "Created by",
      "template.copy_link": "Copy link",
      "template.add_favorites": "Add to favorites",
      "template.remove_favorites": "Remove from favorites",
      
      // Messages
      "msg.login_required": "Please log in to add favorites",
      "msg.added_favorites": "Added to favorites!",
      "msg.removed_favorites": "Removed from favorites",
      "msg.failed_favorites": "Failed to update favorites",
      "msg.template_deleted": "Template deleted",
      "msg.failed_delete": "Failed to delete template",
      "msg.link_copied": "Link copied!",
      "msg.login_to_interact": "Log in to interact with forms",
      "msg.create_template_failed": "Failed to create template. Please try again.",
      
      // Welcome
      "welcome.title": "Welcome!",
      "welcome.message": "Your account has been created successfully.",
      "welcome.submessage": "You can now log in and start using the platform.",
      "welcome.login": "Log in",
      
      // Template Editor
      "editor.templateIdRequired": "Template ID is required",
      "editor.templateNotFound": "Template not found",
      "editor.noPermission": "You don't have permission to edit this template",
      "editor.failedToLoad": "Failed to load template",
      "editor.loadingTemplate": "Loading template...",
      "editor.failedToUpdate": "Failed to update template",
      "editor.updatedSuccessfully": "Template updated successfully!",
      
      // Forms Page
      "forms.failedToLoad": "Failed to load the form",
      "forms.templateSaved": "Template saved successfully",
      "forms.errorSaving": "Error saving template",
      "forms.answersSubmitted": "Answers submitted successfully",
      "forms.errorSubmitting": "Error submitting answers",
      "forms.titleRequired": "The form must have a title.",
      "forms.oneQuestionRequired": "Add at least one question.",
      "forms.questionsNeedText": "All questions must have text.",
      "forms.optionsRequired": "All option questions must have at least one valid option.",
      
      // Modal
      "modal.delete_template": "Delete Template",
      "modal.action_undone": "This action cannot be undone.",
      "modal.delete_confirm": "Are you sure you want to delete this template? All associated data including responses, comments, and likes will be permanently removed.",
      "modal.cancel": "Cancel",
      "modal.delete": "Delete Template",
      
      // Search
      "search.no_results": "No results found for",
      
      // Form Creation
      "form.create_title": "Create new template",
      "form.template_title": "Template title",
      "form.description": "Description", 
      "form.topic": "Topic",
      "form.tags": "Tags",
      "form.allowed_users": "Allowed Users",
      "form.public_access": "Public Access",
      "form.restricted_access": "Restricted Access",
      "form.add_question": "Add Question",
      "form.create": "Create Template",
      "form.required_fields": "Please complete all required fields.",
      "form.min_one_question": "You must add at least one question.",
      "form.question_complete": "Each question must have a title and question text.",
      
      // Topics
      "topic.education": "Education",
      "topic.quiz": "Quiz", 
      "topic.other": "Other",
      
      // Salesforce Integration
      "salesforce.title": "Salesforce Integration",
      "salesforce.description": "Connect your profile to Salesforce CRM",
      "salesforce.company": "Company",
      "salesforce.phone": "Phone",
      "salesforce.website": "Website",
      "salesforce.industry": "Industry",
      "salesforce.annual_revenue": "Annual Revenue",
      "salesforce.employees": "Number of Employees",
      "salesforce.create_account": "Create Salesforce Account",
      "salesforce.success": "Successfully created Salesforce account!",
      "salesforce.error": "Error creating Salesforce account",
      
      // API Token
      "api.token_title": "API Access Token",
      "api.token_description": "Generate token for external integrations",
      "api.generate_token": "Generate New Token",
      "api.token_generated": "Token generated successfully!",
      "api.token_copied": "Token copied to clipboard!",
      
      // Support Ticket
      "support.title": "Create Support Ticket",
      "support.summary": "Issue Summary",
      "support.priority": "Priority",
      "support.priority_high": "High",
      "support.priority_average": "Average", 
      "support.priority_low": "Low",
      "support.create_ticket": "Create Ticket",
      "support.ticket_created": "Support ticket created successfully!",
      
      // User Menu
      "menu.profile": "My profile",
      "menu.adminPanel": "Admin panel",
      "menu.logout": "Log out",
      
      // Admin Panel
      "admin.integrations": "System Integrations",
      "admin.integrationsDesc": "Manage Salesforce integration and API tokens",
      "admin.back": "Back to Admin Panel",
      
      // Admin Integrations Page
      "integrations.title": "Salesforce Integration Center",
      "integrations.subtitle": "Manage your complete Salesforce CRM integration",
      "integrations.connectionStatus": "Connection Status",
      "integrations.connected": "Connected",
      "integrations.disconnected": "Disconnected",
      "integrations.lastSync": "Last Sync",
      "integrations.syncedRecords": "Synced Records",
      "integrations.ago": "ago",
      "integrations.minutes": "minutes",
      
      // Integration Tabs
      "integrations.tabs.dashboard": "Dashboard Analytics",
      "integrations.tabs.dashboardDesc": "Overview and Salesforce metrics",
      "integrations.tabs.salesforce": "Salesforce CRM",
      "integrations.tabs.salesforceDesc": "Manual account and contact management",
      "integrations.tabs.apiConfig": "API Configuration",
      "integrations.tabs.apiConfigDesc": "Token and credentials configuration",
      "integrations.tabs.security": "Security Settings",
      "integrations.tabs.securityDesc": "Security and permissions configuration",
      "integrations.tabs.help": "Help & Documentation",
      "integrations.tabs.helpDesc": "Guides and troubleshooting",
      
      // OAuth Messages
      "oauth.success": "Salesforce connected successfully!",
      "oauth.failed": "OAuth failed",
      "oauth.noCode": "Authorization code not received",
      "oauth.tokenFailed": "Token exchange error",
      "oauth.callbackFailed": "OAuth callback error",
      "oauth.unknownError": "Unknown error",
      
      // API Configuration Tab
      "apiConfig.title": "API Configuration",
      "apiConfig.description": "Manage your Salesforce API credentials and connection settings",
      "apiConfig.clientId": "Client ID",
      "apiConfig.clientSecret": "Client Secret",
      "apiConfig.instanceUrl": "Instance URL",
      "apiConfig.redirectUri": "Redirect URI",
      "apiConfig.testConnection": "Test Connection",
      "apiConfig.saveSettings": "Save Settings",
      "apiConfig.connectionTest": "Connection Test",
      "apiConfig.testSuccess": "Connection test successful!",
      "apiConfig.testFailed": "Connection test failed",
      
      // Security Tab
      "security.title": "Security Settings",
      "security.description": "Configure security policies and access permissions",
      "security.permissions": "Access Permissions",
      "security.adminOnly": "Admin Only Access",
      "security.userAccess": "User Access Enabled",
      "security.encryptData": "Encrypt Transmitted Data",
      "security.enableAudit": "Enable Audit Logging",
      "security.sessionTimeout": "Session Timeout",
      "security.minutes": "minutes",
      "security.saveSettings": "Save Security Settings",
      
      // Help Tab
      "help.title": "Help & Documentation",
      "help.description": "Guides and resources for Salesforce integration",
      "help.setupGuide": "Setup Guide",
      "help.setupDesc": "Step-by-step Salesforce configuration",
      "help.troubleshooting": "Troubleshooting",
      "help.troubleshootDesc": "Common issues and solutions",
      "help.apiDocs": "API Documentation",
      "help.apiDocsDesc": "Complete API reference",
      "help.support": "Contact Support",
      "help.supportDesc": "Get help from our support team",
      
      // Salesforce Dashboard
      "dashboard.salesforce.title": "Salesforce Dashboard",
      "dashboard.salesforce.overview": "Overview",
      "dashboard.salesforce.connection": "Connection",
      "dashboard.salesforce.history": "History",
      "dashboard.salesforce.notConnected": "Salesforce is not connected",
      "dashboard.salesforce.notConnectedDesc": "To use all features, you need to connect your Salesforce account.",
      "dashboard.salesforce.connectButton": "Connect with Salesforce",
      "dashboard.salesforce.testConnection": "Test Connection",
      "dashboard.salesforce.testing": "Testing...",
      "dashboard.salesforce.connectionSuccess": "Salesforce connection successful!",
      "dashboard.salesforce.connectionError": "Salesforce connection error",
      "dashboard.salesforce.networkError": "Network error. Check your connection.",
      "dashboard.salesforce.loginRequired": "You need to log in first",
      "dashboard.salesforce.endpointNotFound": "Endpoint not found. Check server configuration.",
      
      // Dashboard Stats
      "dashboard.stats.accountsCreated": "Accounts Created",
      "dashboard.stats.totalRegistered": "Total registered",
      "dashboard.stats.activeContacts": "Active Contacts",
      "dashboard.stats.inSalesforce": "In Salesforce",
      "dashboard.stats.successfulIntegrations": "Successful Integrations",
      "dashboard.stats.thisMonth": "This month",
      "dashboard.stats.successRate": "Success Rate",
      "dashboard.stats.successfulOperations": "Successful operations",
      
      // Quick Start Guide
      "dashboard.quickStart.title": "Quick Start Guide",
      "dashboard.quickStart.step1.title": "Connect Salesforce",
      "dashboard.quickStart.step1.desc": "Authorize the application to access your Salesforce account",
      "dashboard.quickStart.step2.title": "Create Accounts",
      "dashboard.quickStart.step2.desc": "Use manual integration to create accounts and contacts",
      "dashboard.quickStart.step3.title": "Monitor",
      "dashboard.quickStart.step3.desc": "Review history and statistics of your integrations",
      
      // Connection Status
      "dashboard.connection.title": "Salesforce Connection Status",
      "dashboard.connection.connected": "Connected",
      "dashboard.connection.disconnected": "Disconnected",
      "dashboard.connection.statusActive": "Active",
      "dashboard.connection.statusInactive": "Inactive",
      "dashboard.connection.lastSync": "Last sync",
      "dashboard.connection.never": "Never",
      
      // Configuration Help
      "dashboard.salesforce.configuration.helpTitle": "Need help with configuration?",
      "dashboard.salesforce.configuration.helpText": "If you have problems connecting to Salesforce, verify that:",
      "dashboard.salesforce.configuration.connectedApp": "Your Connected App is configured correctly",
      "dashboard.salesforce.configuration.oauthPermissions": "OAuth permissions are enabled",
      "dashboard.salesforce.configuration.callbackUrl": "The callback URL is registered",
      "dashboard.salesforce.configuration.apiAccess": "You have API access in your Salesforce license",
      
      // Table Headers
      "dashboard.salesforce.table.date": "Date",
      "dashboard.salesforce.table.type": "Type",
      "dashboard.salesforce.table.result": "Result",
      "dashboard.salesforce.table.status": "Status",
      
      // User blocking system
      "blocking": {
        "title": "Account Blocked",
        "message": "Your account has been blocked by an administrator.",
        "reason": "Reason: {{reason}}",
        "redirect_message": "You will be redirected to the login page in {{seconds}} seconds.",
        "contact_admin": "If you believe this is an error, please contact the administrator.",
        "close": "Close",
        "logout_message": "Session terminated due to account blocking"
      }
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.home": "Inicio",
      "nav.forms": "Formularios",
      "nav.login": "Iniciar Sesión", 
      "nav.register": "Registrarse",
      "nav.search.placeholder": "Buscar plantillas, preguntas, comentarios...",
      
      // Dashboard
      "dashboard.title": "Panel de Formularios",
      "dashboard.subtitle": "Crea, gestiona y analiza tus formularios con herramientas poderosas e insights",
      "dashboard.stats.total": "Total de Plantillas",
      "dashboard.stats.favorites": "Favoritos",
      "dashboard.stats.trending": "Tendencias",
      "dashboard.my_templates": "Mis Plantillas",
      "dashboard.manage_organize": "Gestiona y organiza tus plantillas de formularios",
      "dashboard.create_template": "Crear Plantilla",
      "dashboard.no_templates": "Aún no hay plantillas",
      "dashboard.no_templates_desc": "Comienza creando tu primera plantilla de formulario para recopilar respuestas de usuarios.",
      "dashboard.create_first": "Crear Tu Primera Plantilla",
      "dashboard.show_favorites": "Mostrar Solo Favoritos",
      "dashboard.show_all": "Mostrar Todas las Plantillas",
      "dashboard.filtering_by": "Filtrando por:",
      "dashboard.no_templates_tag": "No se encontraron plantillas para esta etiqueta",
      "dashboard.no_templates_tag_desc": "Intenta seleccionar una etiqueta diferente o limpia el filtro para ver todas las plantillas.",
      
      // Template Actions
      "template.public": "Público",
      "template.private": "Privado",
      "template.trending": "Tendencia",
      "template.fill_form": "Llenar Formulario",
      "template.edit": "Editar",
      "template.answers": "Respuestas",
      "template.delete": "Eliminar",
      "template.created_by": "Creado por",
      "template.copy_link": "Copiar enlace",
      "template.add_favorites": "Añadir a favoritos",
      "template.remove_favorites": "Quitar de favoritos",
      
      // Messages
      "msg.login_required": "Por favor inicia sesión para añadir favoritos",
      "msg.added_favorites": "¡Añadido a favoritos!",
      "msg.removed_favorites": "Eliminado de favoritos",
      "msg.failed_favorites": "Error al actualizar favoritos",
      "msg.template_deleted": "Plantilla eliminada",      "msg.failed_delete": "Error al eliminar plantilla",
      "msg.link_copied": "¡Enlace copiado!",
      "msg.login_to_interact": "Inicia sesión para interactuar con formularios",
      "msg.create_template_failed": "Error al crear plantilla. Inténtalo de nuevo.",
      
      // Welcome
      "welcome.title": "¡Bienvenido!",
      "welcome.message": "Tu cuenta ha sido creada exitosamente.",
      "welcome.submessage": "Ahora puedes iniciar sesión y comenzar a usar la plataforma.",
      "welcome.login": "Iniciar sesión",
      
      // Template Editor
      "editor.templateIdRequired": "Se requiere el ID de la plantilla",
      "editor.templateNotFound": "Plantilla no encontrada",
      "editor.noPermission": "No tienes permisos para editar esta plantilla",
      "editor.failedToLoad": "Error al cargar la plantilla",
      "editor.loadingTemplate": "Cargando plantilla...",
      "editor.failedToUpdate": "Error al actualizar la plantilla",
      "editor.updatedSuccessfully": "¡Plantilla actualizada exitosamente!",
      
      // Forms Page
      "forms.failedToLoad": "Error al cargar el formulario",
      "forms.templateSaved": "Plantilla guardada exitosamente",
      "forms.errorSaving": "Error al guardar la plantilla",
      "forms.answersSubmitted": "Respuestas enviadas exitosamente",
      "forms.errorSubmitting": "Error al enviar las respuestas",
      "forms.titleRequired": "El formulario debe tener un título.",
      "forms.oneQuestionRequired": "Agrega al menos una pregunta.",
      "forms.questionsNeedText": "Todas las preguntas deben tener texto.",
      "forms.optionsRequired": "Todas las preguntas de opción deben tener al menos una opción válida.",
      
      // Modal
      "modal.delete_template": "Eliminar Plantilla",
      "modal.action_undone": "Esta acción no se puede deshacer.",
      "modal.delete_confirm": "¿Estás seguro de que quieres eliminar esta plantilla? Todos los datos asociados incluyendo respuestas, comentarios y likes serán eliminados permanentemente.",
      "modal.cancel": "Cancelar",
      "modal.delete": "Eliminar Plantilla",
      
      // Search
      "search.no_results": "No se encontraron resultados para",
      
      // Form Creation
      "form.create_title": "Crear nueva plantilla",
      "form.template_title": "Título de la plantilla",
      "form.description": "Descripción",
      "form.topic": "Tema", 
      "form.tags": "Etiquetas",
      "form.allowed_users": "Usuarios Permitidos",
      "form.public_access": "Acceso Público",
      "form.restricted_access": "Acceso Restringido",
      "form.add_question": "Añadir Pregunta",
      "form.create": "Crear Plantilla",
      "form.required_fields": "Por favor completa todos los campos requeridos.",
      "form.min_one_question": "Debes añadir al menos una pregunta.",
      "form.question_complete": "Cada pregunta debe tener un título y texto de pregunta.",
      
      // Topics
      "topic.education": "Educación",
      "topic.quiz": "Quiz",
      "topic.other": "Otro",
      
      // Salesforce Integration
      "salesforce.title": "Integración con Salesforce",
      "salesforce.description": "Conecta tu perfil con Salesforce CRM",
      "salesforce.company": "Empresa",
      "salesforce.phone": "Teléfono",
      "salesforce.website": "Sitio Web",
      "salesforce.industry": "Industria",
      "salesforce.annual_revenue": "Ingresos Anuales",
      "salesforce.employees": "Número de Empleados",
      "salesforce.create_account": "Crear Cuenta en Salesforce",
      "salesforce.success": "¡Cuenta de Salesforce creada exitosamente!",
      "salesforce.error": "Error al crear cuenta en Salesforce",
      
      // API Token
      "api.token_title": "Token de Acceso API",
      "api.token_description": "Generar token para integraciones externas",
      "api.generate_token": "Generar Nuevo Token",
      "api.token_generated": "¡Token generado exitosamente!",
      "api.token_copied": "¡Token copiado al portapapeles!",
      
      // Support Ticket
      "support.title": "Crear Ticket de Soporte",
      "support.summary": "Resumen del Problema",
      "support.priority": "Prioridad",
      "support.priority_high": "Alta",
      "support.priority_average": "Media",
      "support.priority_low": "Baja",
      "support.create_ticket": "Crear Ticket",
      "support.ticket_created": "¡Ticket de soporte creado exitosamente!",
      
      // User Menu
      "menu.profile": "Mi perfil",
      "menu.adminPanel": "Panel de administrador",
      "menu.logout": "Cerrar sesión",
      
      // Admin Panel
      "admin.integrations": "Integraciones del Sistema",
      "admin.integrationsDesc": "Gestionar integración de Salesforce y tokens API",
      "admin.back": "Volver al Panel de Administrador",
      
      // Admin Integrations Page
      "integrations.title": "Centro de Integración de Salesforce",
      "integrations.subtitle": "Gestiona tu integración completa con Salesforce CRM",
      "integrations.connectionStatus": "Estado de la Conexión",
      "integrations.connected": "Conectado",
      "integrations.disconnected": "Desconectado",
      "integrations.lastSync": "Última Sincronización",
      "integrations.syncedRecords": "Registros Sincronizados",
      "integrations.ago": "hace",
      "integrations.minutes": "minutos",
      
      // Integration Tabs
      "integrations.tabs.dashboard": "Analítica del Panel",
      "integrations.tabs.dashboardDesc": "Descripción general y métricas de Salesforce",
      "integrations.tabs.salesforce": "Salesforce CRM",
      "integrations.tabs.salesforceDesc": "Gestión manual de cuentas y contactos",
      "integrations.tabs.apiConfig": "Configuración de API",
      "integrations.tabs.apiConfigDesc": "Configuración de token y credenciales",
      "integrations.tabs.security": "Configuración de Seguridad",
      "integrations.tabs.securityDesc": "Configuración de seguridad y permisos",
      "integrations.tabs.help": "Ayuda y Documentación",
      "integrations.tabs.helpDesc": "Guías y solución de problemas",
      
      // OAuth Messages
      "oauth.success": "¡Salesforce conectado exitosamente!",
      "oauth.failed": "Error de OAuth",
      "oauth.noCode": "Código de autorización no recibido",
      "oauth.tokenFailed": "Error en el intercambio de token",
      "oauth.callbackFailed": "Error en el callback de OAuth",
      "oauth.unknownError": "Error desconocido",
      
      // API Configuration Tab
      "apiConfig.title": "Configuración de API",
      "apiConfig.description": "Gestiona tus credenciales de API de Salesforce y configuraciones de conexión",
      "apiConfig.clientId": "ID de Cliente",
      "apiConfig.clientSecret": "Secreto de Cliente",
      "apiConfig.instanceUrl": "URL de Instancia",
      "apiConfig.redirectUri": "URI de Redirección",
      "apiConfig.testConnection": "Probar Conexión",
      "apiConfig.saveSettings": "Guardar Configuraciones",
      "apiConfig.connectionTest": "Prueba de Conexión",
      "apiConfig.testSuccess": "¡Prueba de conexión exitosa!",
      "apiConfig.testFailed": "Prueba de conexión fallida",
      
      // Security Tab
      "security.title": "Configuración de Seguridad",
      "security.description": "Configura políticas de seguridad y permisos de acceso",
      "security.permissions": "Permisos de Acceso",
      "security.adminOnly": "Acceso Solo para Administradores",
      "security.userAccess": "Acceso de Usuario Habilitado",
      "security.encryptData": "Cifrar Datos Transmitidos",
      "security.enableAudit": "Habilitar Registro de Auditoría",
      "security.sessionTimeout": "Tiempo de Espera de Sesión",
      "security.minutes": "minutos",
      "security.saveSettings": "Guardar Configuraciones de Seguridad",
      
      // Help Tab
      "help.title": "Ayuda y Documentación",
      "help.description": "Guías y recursos para la integración con Salesforce",
      "help.setupGuide": "Guía de Configuración",
      "help.setupDesc": "Configuración de Salesforce paso a paso",
      "help.troubleshooting": "Solución de Problemas",
      "help.troubleshootDesc": "Problemas comunes y soluciones",
      "help.apiDocs": "Documentación de API",
      "help.apiDocsDesc": "Referencia completa de la API",
      "help.support": "Contactar Soporte",
      "help.supportDesc": "Obtén ayuda de nuestro equipo de soporte",
      
      // Salesforce Dashboard
      "dashboard.salesforce.title": "Panel de Salesforce",
      "dashboard.salesforce.overview": "Vista General",
      "dashboard.salesforce.connection": "Conexión",
      "dashboard.salesforce.history": "Historial",
      "dashboard.salesforce.notConnected": "Salesforce no está conectado",
      "dashboard.salesforce.notConnectedDesc": "Para usar todas las funcionalidades, necesitas conectar tu cuenta de Salesforce.",
      "dashboard.salesforce.connectButton": "Conectar con Salesforce",
      "dashboard.salesforce.testConnection": "Probar Conexión",
      "dashboard.salesforce.testing": "Probando...",
      "dashboard.salesforce.connectionSuccess": "¡Conexión con Salesforce exitosa!",
      "dashboard.salesforce.connectionError": "Error de conexión con Salesforce",
      "dashboard.salesforce.networkError": "Error de red. Verifica tu conexión.",
      "dashboard.salesforce.loginRequired": "Necesitas iniciar sesión primero",
      "dashboard.salesforce.endpointNotFound": "Endpoint no encontrado. Verifica la configuración del servidor.",
      
      // Dashboard Stats
      "dashboard.stats.accountsCreated": "Cuentas Creadas",
      "dashboard.stats.totalRegistered": "Total registradas",
      "dashboard.stats.activeContacts": "Contactos Activos",
      "dashboard.stats.inSalesforce": "En Salesforce",
      "dashboard.stats.successfulIntegrations": "Integraciones Exitosas",
      "dashboard.stats.thisMonth": "Este mes",
      "dashboard.stats.successRate": "Tasa de Éxito",
      "dashboard.stats.successfulOperations": "Operaciones exitosas",
      
      // Quick Start Guide
      "dashboard.quickStart.title": "Guía de Inicio Rápido",
      "dashboard.quickStart.step1.title": "Conectar Salesforce",
      "dashboard.quickStart.step1.desc": "Autoriza la aplicación para acceder a tu cuenta de Salesforce",
      "dashboard.quickStart.step2.title": "Crear Cuentas",
      "dashboard.quickStart.step2.desc": "Usa la integración manual para crear cuentas y contactos",
      "dashboard.quickStart.step3.title": "Monitorear",
      "dashboard.quickStart.step3.desc": "Revisa el historial y estadísticas de tus integraciones",
      
      // Connection Status
      "dashboard.connection.title": "Estado de Conexión con Salesforce",
      "dashboard.connection.connected": "Conectado",
      "dashboard.connection.disconnected": "Desconectado",
      "dashboard.connection.statusActive": "Activo",
      "dashboard.connection.statusInactive": "Inactivo",
      "dashboard.connection.lastSync": "Última sincronización",
      "dashboard.connection.never": "Nunca",
      
      // Configuration Help
      "dashboard.salesforce.configuration.helpTitle": "¿Necesitas ayuda con la configuración?",
      "dashboard.salesforce.configuration.helpText": "Si tienes problemas para conectar con Salesforce, verifica que:",
      "dashboard.salesforce.configuration.connectedApp": "Tu Connected App esté configurado correctamente",
      "dashboard.salesforce.configuration.oauthPermissions": "Los permisos OAuth estén habilitados",
      "dashboard.salesforce.configuration.callbackUrl": "La URL de callback esté registrada",
      "dashboard.salesforce.configuration.apiAccess": "Tengas acceso API en tu licencia de Salesforce",
      
      // Table Headers
      "dashboard.salesforce.table.date": "Fecha",
      "dashboard.salesforce.table.type": "Tipo",
      "dashboard.salesforce.table.result": "Resultado",
      "dashboard.salesforce.table.status": "Estado",
      
      // User blocking system
      "blocking": {
        "title": "Cuenta Bloqueada",
        "message": "Tu cuenta ha sido bloqueada por un administrador.",
        "reason": "Razón: {{reason}}",
        "redirect_message": "Serás redirigido a la página de inicio de sesión en {{seconds}} segundos.",
        "contact_admin": "Si crees que esto es un error, por favor contacta al administrador.",
        "close": "Cerrar",
        "logout_message": "Sesión terminada debido al bloqueo de cuenta"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
