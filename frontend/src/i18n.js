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
      
      // User Status
      "userStatus.blocked": "Your account has been blocked by an administrator.",
      "userStatus.sessionExpired": "Your session has expired. Please log in again.",
      "userStatus.accountBlocked": "Account Blocked",
      "userStatus.redirecting": "Redirecting to login page in",
      "userStatus.seconds": "seconds",
      "userStatus.loginNow": "Go to Login Now",
      
      // Language
      "layout.language": "Language",
      "layout.current": "Current",
      
      // Login
      "login.title": "Log in",
      "login.subtitle": "Enter your credentials to access",
      "login.email": "Email",
      "login.password": "Password",
      "login.submit": "Log in",
      "login.loading": "Logging in...",
      "login.divider": "or",
      "login.google": "Continue with Google",
      "login.noAccount": "Don't have an account?",
      "login.register": "Register",
      "login.failed": "Login failed",
      "login.networkError": "Network or server error",
      
      // Register
      "register.title": "Create account",
      "register.subtitle": "Join us and start creating amazing forms",
      "register.username": "Username",
      "register.email": "Email",
      "register.password": "Password",
      "register.submit": "Create account",
      "register.loading": "Creating account...",
      "register.divider": "or",
      "register.google": "Continue with Google",
      "register.hasAccount": "Already have an account?",
      "register.login": "Log in",
      "register.emailError": "Registration error: the email address must have a valid extension (e.g., .com, .net, .org)",
      "register.failed": "Registration failed",
      "register.networkError": "Network or server error",
      "register.success": "Registration successful!",
      
      // Profile
      "profile.title": "My Profile",
      "profile.subtitle": "Manage your account information and preferences",
      "profile.basicInfo": "Basic Information",
      "profile.name": "Full Name",
      "profile.email": "Email",
      "profile.saveProfile": "Save Profile",
      "profile.saving": "Saving...",
      "profile.password": "Change Password",
      "profile.currentPassword": "Current Password",
      "profile.newPassword": "New Password",
      "profile.savePassword": "Save Password",
      "profile.avatar": "Profile Picture",
      "profile.uploadAvatar": "Upload new profile picture",
      "profile.profileUpdated": "Profile updated successfully!",
      "profile.errorUpdating": "Error updating profile",
      "profile.passwordUpdated": "Password updated successfully!",
      "profile.errorPassword": "Error updating password",
      "profile.avatarUpdated": "Profile picture updated successfully!",
      "profile.errorAvatar": "Error updating profile picture",
      "profile.selectImage": "Select an image",
      "profile.uploadImage": "Upload Image",
      "profile.uploading": "Uploading...",
      
      // Footer
      "footer.rights": "All rights reserved",
      
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
      
      // User Status
      "userStatus.blocked": "Tu cuenta ha sido bloqueada por un administrador.",
      "userStatus.sessionExpired": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      "userStatus.accountBlocked": "Cuenta Bloqueada",
      "userStatus.redirecting": "Redirigiendo a la página de inicio de sesión en",
      "userStatus.seconds": "segundos",
      "userStatus.loginNow": "Ir al Login Ahora",
      
      // Language
      "layout.language": "Idioma",
      "layout.current": "Actual",
      
      // Login
      "login.title": "Iniciar sesión",
      "login.subtitle": "Ingresa tus credenciales para acceder",
      "login.email": "Correo electrónico",
      "login.password": "Contraseña",
      "login.submit": "Iniciar sesión",
      "login.loading": "Iniciando sesión...",
      "login.divider": "o",
      "login.google": "Continuar con Google",
      "login.noAccount": "¿No tienes una cuenta?",
      "login.register": "Registrarse",
      "login.failed": "Error al iniciar sesión",
      "login.networkError": "Error de red o servidor",
      
      // Register
      "register.title": "Crear cuenta",
      "register.subtitle": "Únete a nosotros y comienza a crear formularios increíbles",
      "register.username": "Nombre de usuario",
      "register.email": "Correo electrónico",
      "register.password": "Contraseña",
      "register.submit": "Crear cuenta",
      "register.loading": "Creando cuenta...",
      "register.divider": "o",
      "register.google": "Continuar con Google",
      "register.hasAccount": "¿Ya tienes una cuenta?",
      "register.login": "Iniciar sesión",
      "register.emailError": "Error de registro: la dirección de correo debe tener una extensión válida (ej., .com, .net, .org)",
      "register.failed": "Error en el registro",
      "register.networkError": "Error de red o servidor",
      "register.success": "¡Registro exitoso!",
      
      // Profile
      "profile.title": "Mi Perfil",
      "profile.subtitle": "Gestiona la información de tu cuenta y preferencias",
      "profile.basicInfo": "Información Básica",
      "profile.name": "Nombre Completo",
      "profile.email": "Correo Electrónico",
      "profile.saveProfile": "Guardar Perfil",
      "profile.saving": "Guardando...",
      "profile.password": "Cambiar Contraseña",
      "profile.currentPassword": "Contraseña Actual",
      "profile.newPassword": "Nueva Contraseña",
      "profile.savePassword": "Guardar Contraseña",
      "profile.avatar": "Foto de Perfil",
      "profile.uploadAvatar": "Subir nueva foto de perfil",
      "profile.profileUpdated": "¡Perfil actualizado exitosamente!",
      "profile.errorUpdating": "Error al actualizar el perfil",
      "profile.passwordUpdated": "¡Contraseña actualizada exitosamente!",
      "profile.errorPassword": "Error al actualizar la contraseña",
      "profile.avatarUpdated": "¡Foto de perfil actualizada exitosamente!",
      "profile.errorAvatar": "Error al actualizar la foto de perfil",
      "profile.selectImage": "Seleccionar una imagen",
      "profile.uploadImage": "Subir Imagen",
      "profile.uploading": "Subiendo...",
      
      // Footer
      "footer.rights": "Todos los derechos reservados",
      
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
