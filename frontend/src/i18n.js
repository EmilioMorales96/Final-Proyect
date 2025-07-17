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
      
      // Login Page
      "login.title": "Welcome Back",
      "login.subtitle": "Sign in to your account to continue",
      "login.email": "Email",
      "login.password": "Password",
      "login.submit": "Sign In",
      "login.loading": "Signing in...",
      "login.failed": "Login failed",
      "login.networkError": "Network error. Please try again.",
      "login.divider": "or",
      "login.google": "Continue with Google",
      "login.noAccount": "Don't have an account?",
      "login.register": "Sign up",
      
      // Register Page
      "register.title": "Create Account",
      "register.subtitle": "Join us to start creating forms",
      "register.username": "Username",
      "register.email": "Email",
      "register.password": "Password",
      "register.submit": "Sign Up",
      "register.loading": "Creating account...",
      "register.failed": "Registration failed",
      "register.success": "Account created successfully!",
      "register.networkError": "Network error. Please try again.",
      "register.emailError": "Please enter a valid email address",
      "register.divider": "or",
      "register.google": "Sign up with Google",
      "register.hasAccount": "Already have an account?",
      "register.login": "Sign in",
      
      // Profile Page
      "profile.title": "My Profile",
      "profile.name": "Name",
      "profile.email": "Email",
      "profile.saveProfile": "Save Profile",
      "profile.saving": "Saving...",
      "profile.profileUpdated": "Profile updated successfully!",
      "profile.errorUpdating": "Error updating profile",
      "profile.password": "Change Password",
      "profile.currentPassword": "Current Password",
      "profile.newPassword": "New Password",
      "profile.passwordUpdated": "Password updated successfully!",
      "profile.errorPassword": "Error updating password",
      
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
      "integrations.tabs.accounts": "Account Manager",
      "integrations.tabs.accountsDesc": "View and manage created Salesforce accounts",
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
      "dashboard.salesforce.leadScoring": "Lead Scoring",
      "dashboard.salesforce.emailAutomation": "Email Automation",
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
      
      // Lead Scoring System
      "leadScoring": {
        "title": "Lead Scoring Dashboard",
        "subtitle": "AI-powered lead qualification and routing",
        "leadsAnalyzed": "leads analyzed",
        "hotLeads": "Hot Leads (A)",
        "warmLeads": "Warm Leads (B)", 
        "coldLeads": "Cold Leads (C)",
        "lowPriority": "Low Priority (D)",
        "scoreRange": {
          "hot": "Score 80+",
          "warm": "Score 60-79",
          "cold": "Score 40-59",
          "low": "Score <40"
        },
        "priorityLeads": "Priority Leads",
        "requiresAttention": "Requires immediate attention",
        "noHighPriority": "No high-priority leads at the moment",
        "leadDetails": "Lead Details",
        "companyInformation": "Company Information",
        "company": "Company",
        "industry": "Industry", 
        "employees": "Employees",
        "revenue": "Revenue",
        "scoreBreakdown": "Score Breakdown",
        "industryScore": "Industry",
        "companySizeScore": "Company Size",
        "revenueScore": "Revenue",
        "completionScore": "Form Completion",
        "totalScore": "Total Score",
        "actionRecommendations": "Action Recommendations",
        "scheduledEmailSequence": "Scheduled Email Sequence",
        "emailsScheduled": "emails scheduled",
        "viewInSalesforce": "View in Salesforce",
        "close": "Close"
      },

      // Email Automation System
      "emailAutomation": {
        "title": "Email Automation",
        "subtitle": "Intelligent email sequences based on lead scoring",
        "configure": "Configure",
        "emailsSent": "Emails Sent",
        "openRate": "Open Rate",
        "clickRate": "Click Rate",
        "conversionRate": "Conversion Rate",
        "industryAverage": "Industry avg",
        "leadsToCustomers": "Leads to customers",
        "fromLastMonth": "from last month",
        "activeSequences": "Active Sequences",
        "running": "running",
        "emailTemplates": "Email Templates",
        "viewAll": "View All",
        "variables": "variables",
        "preview": "Preview",
        "edit": "Edit",
        "sequencePerformance": "Sequence Performance",
        "sequence": "Sequence",
        "sent": "Sent",
        "replyRate": "Reply Rate",
        "conversion": "Conversion",
        "noActiveSequences": "No active email sequences",
        "emailPreview": "Email Preview",
        "subject": "Subject",
        "sendTest": "Send Test",
        "step": "Step",
        "status": {
          "active": "active",
          "paused": "paused", 
          "completed": "completed"
        }
      },
      
      // Salesforce Manual Integration
      "integration": {
        "manual": {
          "title": "Salesforce CRM Integration",
          "subtitle": "Create accounts and manage contacts in Salesforce directly from your application",
          "createButton": "Create New Account",
          "success": "Salesforce account created successfully!",
          "error": "Error creating Salesforce account",
          "connectionError": "Connection error. Please check your settings and try again.",
          "modal": {
            "title": "Create Salesforce Account",
            "subtitle": "Fill in the company information to create a new account in Salesforce"
          },
          "features": {
            "createAccounts": {
              "title": "Create Company Accounts",
              "description": "Add new companies directly to your Salesforce CRM with complete information"
            },
            "manageContacts": {
              "title": "Manage Contacts",
              "description": "Automatically create and link contacts to company accounts"
            },
            "autoValidation": {
              "title": "Data Validation",
              "description": "Automatic validation and enrichment of company data"
            }
          },
          "sections": {
            "companyInfo": "Company Information",
            "contactInfo": "Contact Information", 
            "businessData": "Business Data"
          },
          "form": {
            "companyName": "Company Name",
            "companyNamePlaceholder": "Enter company name",
            "industry": "Industry",
            "selectIndustry": "Select an industry",
            "phone": "Phone Number",
            "phonePlaceholder": "+1 (555) 123-4567",
            "website": "Website",
            "websitePlaceholder": "https://company.com",
            "employees": "Number of Employees",
            "selectEmployees": "Select employee range",
            "annualRevenue": "Annual Revenue",
            "annualRevenuePlaceholder": "Enter annual revenue in USD"
          },
          "buttons": {
            "cancel": "Cancel",
            "create": "Create Account",
            "creating": "Creating..."
          },
          "viewAccounts": "View Accounts",
          "accountsPanel": {
            "title": "Created Accounts",
            "subtitle": "Manage your Salesforce accounts from here",
            "noAccounts": "No accounts created yet",
            "createFirst": "Create your first Salesforce account to get started"
          },
          "viewInSalesforce": "View in Salesforce",
          "synced": "Synced",
          "employees": "employees",
          "noIndustry": "No industry",
          "createdOn": "Created on",
          "validation": {
            "companyRequired": "Company name is required",
            "companyTooShort": "Company name must be at least 2 characters",
            "phoneInvalid": "Please enter a valid phone number",
            "websiteInvalid": "Please enter a valid website URL (starting with http:// or https://)",
            "revenueInvalid": "Please enter a valid revenue amount",
            "formHasErrors": "Please correct the errors before submitting"
          }
        }
      },

      // Industries
      "industry": {
        "technology": "Technology",
        "healthcare": "Healthcare",
        "finance": "Finance",
        "education": "Education",
        "manufacturing": "Manufacturing",
        "retail": "Retail",
        "realEstate": "Real Estate",
        "consulting": "Consulting",
        "other": "Other"
      },

      // Employee ranges
      "employees": {
        "1-10": "1-10 employees",
        "11-50": "11-50 employees", 
        "51-200": "51-200 employees",
        "201-500": "201-500 employees",
        "501-1000": "501-1000 employees",
        "1000+": "1000+ employees"
      },
      
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
      
      // Login Page
      "login.title": "Bienvenido de Vuelta",
      "login.subtitle": "Inicia sesión en tu cuenta para continuar",
      "login.email": "Correo Electrónico",
      "login.password": "Contraseña",
      "login.submit": "Iniciar Sesión",
      "login.loading": "Iniciando sesión...",
      "login.failed": "Error al iniciar sesión",
      "login.networkError": "Error de red. Por favor intenta de nuevo.",
      "login.divider": "o",
      "login.google": "Continuar con Google",
      "login.noAccount": "¿No tienes una cuenta?",
      "login.register": "Regístrate",
      
      // Register Page
      "register.title": "Crear Cuenta",
      "register.subtitle": "Únete para comenzar a crear formularios",
      "register.username": "Nombre de Usuario",
      "register.email": "Correo Electrónico",
      "register.password": "Contraseña",
      "register.submit": "Registrarse",
      "register.loading": "Creando cuenta...",
      "register.failed": "Error en el registro",
      "register.success": "¡Cuenta creada exitosamente!",
      "register.networkError": "Error de red. Por favor intenta de nuevo.",
      "register.emailError": "Por favor ingresa un correo electrónico válido",
      "register.divider": "o",
      "register.google": "Registrarse con Google",
      "register.hasAccount": "¿Ya tienes una cuenta?",
      "register.login": "Inicia sesión",
      
      // Profile Page
      "profile.title": "Mi Perfil",
      "profile.name": "Nombre",
      "profile.email": "Correo Electrónico",
      "profile.saveProfile": "Guardar Perfil",
      "profile.saving": "Guardando...",
      "profile.profileUpdated": "¡Perfil actualizado exitosamente!",
      "profile.errorUpdating": "Error al actualizar el perfil",
      "profile.password": "Cambiar Contraseña",
      "profile.currentPassword": "Contraseña Actual",
      "profile.newPassword": "Nueva Contraseña",
      "profile.passwordUpdated": "¡Contraseña actualizada exitosamente!",
      "profile.errorPassword": "Error al actualizar la contraseña",
      
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
      "integrations.tabs.accounts": "Gestor de Cuentas",
      "integrations.tabs.accountsDesc": "Ver y gestionar cuentas de Salesforce creadas",
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
      "dashboard.salesforce.leadScoring": "Calificación de Leads",
      "dashboard.salesforce.emailAutomation": "Automatización de Emails",
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
      
      // Lead Scoring System
      "leadScoring": {
        "title": "Dashboard de Calificación de Leads",
        "subtitle": "Calificación y enrutamiento de leads con IA",
        "leadsAnalyzed": "leads analizados",
        "hotLeads": "Leads Calientes (A)",
        "warmLeads": "Leads Tibios (B)", 
        "coldLeads": "Leads Fríos (C)",
        "lowPriority": "Baja Prioridad (D)",
        "scoreRange": {
          "hot": "Puntuación 80+",
          "warm": "Puntuación 60-79",
          "cold": "Puntuación 40-59",
          "low": "Puntuación <40"
        },
        "priorityLeads": "Leads Prioritarios",
        "requiresAttention": "Requiere atención inmediata",
        "noHighPriority": "No hay leads de alta prioridad en este momento",
        "leadDetails": "Detalles del Lead",
        "companyInformation": "Información de la Empresa",
        "company": "Empresa",
        "industry": "Industria", 
        "employees": "Empleados",
        "revenue": "Ingresos",
        "scoreBreakdown": "Desglose de Puntuación",
        "industryScore": "Industria",
        "companySizeScore": "Tamaño de Empresa",
        "revenueScore": "Ingresos",
        "completionScore": "Completado del Formulario",
        "totalScore": "Puntuación Total",
        "actionRecommendations": "Recomendaciones de Acción",
        "scheduledEmailSequence": "Secuencia de Email Programada",
        "emailsScheduled": "emails programados",
        "viewInSalesforce": "Ver en Salesforce",
        "close": "Cerrar"
      },

      // Email Automation System
      "emailAutomation": {
        "title": "Automatización de Emails",
        "subtitle": "Secuencias inteligentes de email basadas en calificación de leads",
        "configure": "Configurar",
        "emailsSent": "Emails Enviados",
        "openRate": "Tasa de Apertura",
        "clickRate": "Tasa de Clics",
        "conversionRate": "Tasa de Conversión",
        "industryAverage": "Promedio industria",
        "leadsToCustomers": "Leads a clientes",
        "fromLastMonth": "del mes pasado",
        "activeSequences": "Secuencias Activas",
        "running": "ejecutándose",
        "emailTemplates": "Plantillas de Email",
        "viewAll": "Ver Todas",
        "variables": "variables",
        "preview": "Vista Previa",
        "edit": "Editar",
        "sequencePerformance": "Rendimiento de Secuencias",
        "sequence": "Secuencia",
        "sent": "Enviados",
        "replyRate": "Tasa de Respuesta",
        "conversion": "Conversión",
        "noActiveSequences": "No hay secuencias de email activas",
        "emailPreview": "Vista Previa del Email",
        "subject": "Asunto",
        "sendTest": "Enviar Prueba",
        "step": "Paso",
        "status": {
          "active": "activo",
          "paused": "pausado", 
          "completed": "completado"
        }
      },
      
      // Salesforce Manual Integration
      "integration": {
        "manual": {
          "title": "Integración con Salesforce CRM",
          "subtitle": "Crea cuentas y gestiona contactos en Salesforce directamente desde tu aplicación",
          "createButton": "Crear Nueva Cuenta",
          "success": "¡Cuenta de Salesforce creada exitosamente!",
          "error": "Error al crear cuenta en Salesforce",
          "connectionError": "Error de conexión. Por favor verifica tu configuración e intenta de nuevo.",
          "modal": {
            "title": "Crear Cuenta en Salesforce",
            "subtitle": "Completa la información de la empresa para crear una nueva cuenta en Salesforce"
          },
          "features": {
            "createAccounts": {
              "title": "Crear Cuentas de Empresa",
              "description": "Añade nuevas empresas directamente a tu CRM de Salesforce con información completa"
            },
            "manageContacts": {
              "title": "Gestionar Contactos",
              "description": "Crea y vincula automáticamente contactos a las cuentas de empresa"
            },
            "autoValidation": {
              "title": "Validación de Datos",
              "description": "Validación automática y enriquecimiento de datos de empresa"
            }
          },
          "sections": {
            "companyInfo": "Información de la Empresa",
            "contactInfo": "Información de Contacto", 
            "businessData": "Datos Empresariales"
          },
          "form": {
            "companyName": "Nombre de la Empresa",
            "companyNamePlaceholder": "Ingrese el nombre de la empresa",
            "industry": "Industria",
            "selectIndustry": "Seleccione una industria",
            "phone": "Número de Teléfono",
            "phonePlaceholder": "+1 (555) 123-4567",
            "website": "Sitio Web",
            "websitePlaceholder": "https://empresa.com",
            "employees": "Número de Empleados",
            "selectEmployees": "Seleccione rango de empleados",
            "annualRevenue": "Ingresos Anuales",
            "annualRevenuePlaceholder": "Ingrese ingresos anuales en USD"
          },
          "buttons": {
            "cancel": "Cancelar",
            "create": "Crear Cuenta",
            "creating": "Creando..."
          },
          "viewAccounts": "Ver Cuentas",
          "accountsPanel": {
            "title": "Cuentas Creadas",
            "subtitle": "Gestiona tus cuentas de Salesforce desde aquí",
            "noAccounts": "No hay cuentas creadas aún",
            "createFirst": "Crea tu primera cuenta de Salesforce para comenzar"
          },
          "viewInSalesforce": "Ver en Salesforce",
          "synced": "Sincronizado",
          "employees": "empleados",
          "noIndustry": "Sin industria",
          "createdOn": "Creado el",
          "validation": {
            "companyRequired": "El nombre de la empresa es requerido",
            "companyTooShort": "El nombre de la empresa debe tener al menos 2 caracteres",
            "phoneInvalid": "Por favor ingrese un número de teléfono válido",
            "websiteInvalid": "Por favor ingrese una URL válida (que comience con http:// o https://)",
            "revenueInvalid": "Por favor ingrese una cantidad de ingresos válida",
            "formHasErrors": "Por favor corrija los errores antes de enviar"
          }
        }
      },

      // Industries
      "industry": {
        "technology": "Tecnología",
        "healthcare": "Salud",
        "finance": "Finanzas",
        "education": "Educación",
        "manufacturing": "Manufactura",
        "retail": "Retail",
        "realEstate": "Bienes Raíces",
        "consulting": "Consultoría",
        "other": "Otro"
      },

      // Employee ranges
      "employees": {
        "1-10": "1-10 empleados",
        "11-50": "11-50 empleados", 
        "51-200": "51-200 empleados",
        "201-500": "201-500 empleados",
        "501-1000": "501-1000 empleados",
        "1000+": "1000+ empleados"
      },
      
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
