# Backend - Dynamic Forms API

## Quick Deployment Fix

This backend has been configured to resolve the Cloudinary dependency conflict automatically.

### Files Added for Deployment:
- `.npmrc` - Contains `legacy-peer-deps=true` to handle dependency conflicts
- `.node-version` - Specifies Node.js 20.19.2 for Render

### Render Configuration:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 20.19.2 (auto-detected from .node-version)

### Environment Variables Required:
```
DATABASE_URL=<neon-postgresql-url>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloudinary-name>
CLOUDINARY_API_KEY=<cloudinary-key>
CLOUDINARY_API_SECRET=<cloudinary-secret>
```

### Optional Integration Variables:
```
SALESFORCE_INSTANCE_URL=<salesforce-url>
SALESFORCE_CLIENT_ID=<salesforce-client-id>
SALESFORCE_CLIENT_SECRET=<salesforce-secret>
ONEDRIVE_ACCESS_TOKEN=<onedrive-token>
DROPBOX_ACCESS_TOKEN=<dropbox-token>
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Templates & Forms
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template
- `GET /api/forms/:templateId` - Get forms for template
- `POST /api/forms` - Submit form response

### Integrations
- `POST /api/salesforce/create-account` - Create Salesforce account
- `GET /api/external/user-templates/:userId` - External API for Odoo
- `POST /api/support/create-ticket` - Create support ticket
- `POST /api/users/generate-token` - Generate API token

## Local Development
```bash
npm install
cp ../.env.example .env
# Edit .env with your credentials
npm run dev
```

## Troubleshooting
If deployment fails, check:
1. All environment variables are set in Render dashboard
2. DATABASE_URL includes `?sslmode=require` for Neon
3. Build logs for specific errors
4. Node.js version compatibility
