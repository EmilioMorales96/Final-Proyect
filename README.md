# Dynamic Forms Application with External Integrations

A full-stack web application for creating and managing dynamic forms with three external system integrations.

## 🚀 Live Demo
- **Frontend:** [https://frontend-9ajm.onrender.com](https://frontend-9ajm.onrender.com) ✅ **LIVE**
- **Backend API:** [https://backend-service-pu47.onrender.com](https://backend-service-pu47.onrender.com) ✅ **LIVE**

## 📋 Project Overview

This application allows users to create dynamic form templates, collect responses, and integrate with external systems including Salesforce, Odoo, and Microsoft Power Automate.

### Key Features
- **Dynamic Form Builder:** Create custom forms with multiple question types
- **User Management:** Registration, authentication, and user profiles
- **Template System:** Create and manage reusable form templates
- **Response Analytics:** View and analyze form responses
- **External Integrations:** Three fully implemented integrations
- **Internationalization:** Support for English and Spanish
- **Responsive Design:** Mobile-friendly interface

## 🔗 External Integrations

### 1. Salesforce Integration ✅
- Create Salesforce Accounts and Contacts from user profiles
- Client Credentials Flow authentication
- Company information collection and mapping

### 2. Odoo Integration ✅
- API token generation for external access
- Aggregated template and form data endpoints
- Ready for Odoo module integration

### 3. Power Automate Integration ✅
- Support ticket creation system
- OneDrive/Dropbox file upload
- Floating help button on all pages
- JSON file generation for automated workflows

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **react-i18next** - Internationalization
- **Axios** - HTTP client

### Backend
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Cloudinary** - Image upload and management
- **Multer** - File upload middleware

### Database
- **Neon PostgreSQL** - Cloud database service
- **Sequelize Models** - User, Template, Form, Question, Comment, Like, Favorite, Tag

### Deployment
- **Render** - Cloud hosting platform
- **GitHub** - Version control and CI/CD

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or Neon)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/EmilioMorales96/Final-Proyect.git
   cd Final-Proyect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp ../.env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Environment Configuration**
   
   Create `.env` files in both backend and frontend directories using `.env.example` as template.

   **Minimum required variables:**
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `CLOUDINARY_*` - Cloudinary credentials for file uploads

## 🚀 Deployment

### Production Deployment on Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Setup:**
1. Connect GitHub repository to Render
2. Create Web Service for backend
3. Create Static Site for frontend
4. Configure environment variables
5. Deploy!

## 📚 Documentation

- **[PROJECT_FINAL.md](./PROJECT_FINAL.md)** - Complete project documentation
- **[INTEGRATIONS.md](./INTEGRATIONS.md)** - External integrations guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[SECURITY.md](./SECURITY.md)** - Security guidelines
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current project status

## 🔐 Security

- Environment variables for sensitive data
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Secure file upload handling

## 🌐 Internationalization

The application supports multiple languages:
- **English** (default)
- **Spanish**

Language can be switched from the user interface.

## 📊 Project Status

- ✅ **Frontend:** Live at https://frontend-9ajm.onrender.com
- ✅ **Backend:** Live at https://backend-service-pu47.onrender.com 
- ✅ **Database:** Connected (Neon PostgreSQL)
- ✅ **Integrations:** 3/3 fully implemented
- ✅ **Documentation:** Complete
- ✅ **Security:** Repository cleaned and secured
- ✅ **Deployment:** Complete and Live in Production

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run build
npm run preview
```

### Backend Testing
```bash
cd backend
npm start
```

### Integration Testing
Run the deployment verification script:
```bash
node check-deployment.js
```

## 🤝 Contributing

This is a final project for academic submission. For any questions or suggestions, please contact the project author.

## 📄 License

This project is developed for educational purposes as part of a final course project.

## 👨‍💻 Author

**Emilio Morales**
- GitHub: [@EmilioMorales96](https://github.com/EmilioMorales96)
- Project: Final Course Project - Dynamic Forms with Integrations

## 📅 Project Timeline

- **Development Period:** July 2025
- **Submission Deadline:** July 16, 2025
- **Status:** Complete and Ready for Submission

---

**Note:** This application demonstrates the implementation of external integrations with real-world systems including Salesforce CRM, Odoo ERP, and Microsoft Power Automate for workflow automation.
