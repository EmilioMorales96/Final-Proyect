# Security Guide - Sensitive Information

## ⚠️ IMPORTANT: Files that should NOT be uploaded to repository

### Environment Files
- ❌ `.env` (any variant)
- ❌ `backend/.env`
- ❌ `frontend/.env`
- ✅ `.env.example` (SHOULD be included as template)

### Credentials and Keys
- ❌ Any file with real database credentials
- ❌ API tokens (Salesforce, OneDrive, Dropbox)
- ❌ JWT secret keys
- ❌ Certificates and private keys (.pem, .key, .p12)

### Configuration Files
- ❌ `config.json` with production data
- ❌ `credentials.json`
- ❌ Google Cloud service account keys
- ❌ AWS credentials

## 🔒 Sensitive Information Detected and Removed

During repository preparation, the following were found and removed:

1. **`backend/.env`** - Contained real Neon PostgreSQL credentials:
   - Host: ep-flat-dust-a8o7mmbc-pooler.eastus2.azure.neon.tech
   - Database user and password
   - ⚠️ **NEVER upload these credentials to repository**

2. **`frontend/.env`** - Contained production backend URL:
   - VITE_API_URL=https://backend-service-pu47.onrender.com

## ✅ Improvements Implemented in .gitignore

### Environment Files Protection
```gitignore
.env
.env.*
!.env.example
backend/.env
frontend/.env
```

### Credentials Protection
```gitignore
backend/config/config.json
credentials.json
keys.json
*.pem
*.key
private_key.json
service-account-key.json
```

### Uploads and User Data Protection
```gitignore
uploads/
backend/uploads/
temp/
tmp/
```

### Integrations Protection
```gitignore
salesforce_credentials.json
onedrive_tokens.json
dropbox_tokens.json
oauth_tokens.json
api_keys.json
```

## 📋 Checklist Before Uploading to Repository

- [x] `.env` files removed
- [x] `.gitignore` updated with complete protections
- [x] No hardcoded credentials in code
- [x] `.env.example` file created as template
- [x] Deployment documentation updated

## 🚀 Deployment Configuration

### Environment Variables in Render
Configure manually in Render dashboard:
```
DATABASE_URL=<neon-connection-string>
JWT_SECRET=<generate-new-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

### Environment Variables for Frontend
Configure in Render Static Site:
```
VITE_API_URL=https://your-backend-app.onrender.com
```

## 📖 Best Practices

1. **Never hardcode credentials** in source code
2. **Use environment variables** for all sensitive information
3. **Review .gitignore** before each commit
4. **Generate new secrets** for production
5. **Rotate tokens and keys** periodically

---

**Review date:** $(Get-Date -Format "yyyy-MM-dd HH:mm")  
**Status:** Repository clean and safe to upload
