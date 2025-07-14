# Deployment Guide - Render & Neon

## Backend Deployment (Render)

### 1. Database Setup (Neon)
1. Go to https://neon.tech and create account
2. Create new project
3. Copy the connection string (starts with `postgresql://`)
4. Note: Neon provides DATABASE_URL automatically

### 2. Render Setup
1. Connect your GitHub repository to Render
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard:

#### Required Environment Variables for Render:
```
DATABASE_URL=<your-neon-connection-string>
JWT_SECRET=<generate-strong-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

#### For Integrations (optional):
```
SALESFORCE_INSTANCE_URL=https://your-domain.salesforce.com
SALESFORCE_CLIENT_ID=<your-salesforce-client-id>
SALESFORCE_CLIENT_SECRET=<your-salesforce-client-secret>
ONEDRIVE_ACCESS_TOKEN=<your-onedrive-token>
DROPBOX_ACCESS_TOKEN=<your-dropbox-token>
```

### 3. Frontend Deployment (Render Static Site)
1. Create new Static Site in Render
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-backend-app.onrender.com`

## Integration Setup Instructions

### Salesforce Integration
1. Create Developer Org: https://developer.salesforce.com/signup
2. Setup → App Manager → New Connected App
3. Enable OAuth Settings with Client Credentials Flow
4. Add scopes: `api`, `web`
5. Copy Client ID and Secret to Render environment variables

### Power Automate Integration
1. **OneDrive Setup:**
   - Register app in Azure AD
   - Get access token with Files.ReadWrite permission
   - Add token to ONEDRIVE_ACCESS_TOKEN

2. **Dropbox Setup:**
   - Create app at https://www.dropbox.com/developers/apps
   - Generate access token
   - Add token to DROPBOX_ACCESS_TOKEN

3. **Power Automate Flow:**
   - Trigger: When file created in OneDrive/Dropbox
   - Action: Read JSON content
   - Action: Send email (Gmail)
   - Action: Send mobile notification

### Odoo Integration
- Deploy separate Odoo instance or use Odoo.com
- Create custom module for template data import
- Use API tokens generated from user profiles

## Testing Checklist
- [ ] Backend starts without errors
- [ ] Database connection works
- [ ] Frontend can connect to backend API
- [ ] User registration/login works
- [ ] File uploads work (Cloudinary)
- [ ] All three integrations are accessible from UI

## Troubleshooting

### Common Deployment Issues

#### 1. Cloudinary Dependency Conflict ✅ SOLVED
**Error:** `ERESOLVE unable to resolve dependency tree - peer cloudinary@"^1.21.0" from multer-storage-cloudinary@4.0.0`

**Solution:** The project includes a `.npmrc` file in the backend directory with `legacy-peer-deps=true` to automatically handle this conflict. No manual intervention needed.

If you still encounter issues, you can manually add `--legacy-peer-deps` to the build command in Render dashboard.

#### 2. General Troubleshooting
- Check Render logs for startup errors
- Verify all environment variables are set
- Ensure DATABASE_URL includes `?sslmode=require`
- Check CORS settings for frontend domain
- Verify Node.js version compatibility (recommended: 18.x or 20.x)

#### 3. Build Command Issues
If the build fails, try these build commands in order:
1. `npm install` (default, should work with .npmrc)
2. `npm install --legacy-peer-deps` (if .npmrc is ignored)
3. `npm ci --legacy-peer-deps` (for clean install)
