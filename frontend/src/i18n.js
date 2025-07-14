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
      
      // Footer
      "footer.rights": "All rights reserved"
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
      "msg.template_deleted": "Plantilla eliminada",
      "msg.failed_delete": "Error al eliminar plantilla", 
      "msg.link_copied": "¡Enlace copiado!",
      "msg.login_to_interact": "Inicia sesión para interactuar con formularios",
      
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
      
      // Footer
      "footer.rights": "Todos los derechos reservados"
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
