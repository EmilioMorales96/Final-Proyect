# Forms App - External Integrations

This application includes three major external integrations as requested for the final project submission.

## Integration Status: ✅ COMPLETED

All three integrations have been fully implemented and are ready for testing and demonstration.

## 1. Salesforce Integration ✅

### Features
- Create Salesforce Account and Contact from user profile
- Collects additional business information (company, industry, revenue, etc.)
- Uses Salesforce REST API v57.0 with client credentials flow
- Available only to authenticated users from their profile page

### Setup
1. Create a Salesforce Developer Org at https://developer.salesforce.com/signup
2. Create a Connected App in Salesforce:
   - Go to Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Select "Client Credentials Flow" 
   - Add required OAuth scopes
3. Configure environment variables:
   ```
   SALESFORCE_INSTANCE_URL=https://your-domain.salesforce.com
   SALESFORCE_CLIENT_ID=your_client_id
   SALESFORCE_CLIENT_SECRET=your_client_secret
   ```

### Usage
- Go to Profile page
- Find "Salesforce Integration" section
- Click "Create Salesforce Account"
- Fill in company information
- Submit to create Account and Contact in Salesforce

## 2. Odoo Integration (API for External Access)

### Features
- Generate API tokens for external access
- Provides aggregated form data via REST API
- Returns template information and response statistics

### API Endpoints
- `POST /api/users/generate-token` - Generate API token
- `GET /api/external/templates` - Get user's templates with aggregated data
- `GET /api/external/templates/:id` - Get detailed template data

### API Usage
```bash
# Generate token (authenticated)
curl -X POST http://localhost:3000/api/users/generate-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Access template data (using API token)
curl -X GET http://localhost:3000/api/external/templates \
  -H "X-API-Token: YOUR_API_TOKEN"
```

### Odoo Application Setup
To create an Odoo application that consumes this API:

1. Install Odoo (https://www.odoo.com/)
2. Create a custom module with models for:
   - Template (author, title, questions, aggregated results)
   - Question (text, type, answer statistics)
3. Implement import functionality using the API endpoints
4. Create views for templates and detailed analytics

## 3. Power Automate Integration (Support Tickets)

### Features
- Create support tickets from any page
- Upload ticket JSON to OneDrive or Dropbox
- Trigger Power Automate flows for notifications

### Setup
1. Configure cloud storage access:
   ```
   ONEDRIVE_ACCESS_TOKEN=your_token  # OR
   DROPBOX_ACCESS_TOKEN=your_token
   ```

2. Create Power Automate Flow:
   - Trigger: "When a file is created" (OneDrive/Dropbox)
   - Action: Parse JSON content
   - Action: Send email with ticket details
   - Action: Send mobile notification

### Usage
- Click the floating help button (bottom right)
- Fill in issue summary and priority
- Submit ticket
- JSON file is uploaded to cloud storage
- Power Automate flow is triggered automatically

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Fill in all required values for the integrations you want to use.

## Database Migration

The User model has been updated to include an `apiToken` field. Run database sync:

```bash
npm run dev  # Will auto-sync with { alter: true }
```

## Testing the Integrations

### Salesforce
1. Configure Salesforce credentials
2. Go to Profile → Salesforce Integration
3. Create an account with test data
4. Verify Account and Contact creation in Salesforce

### API/Odoo
1. Generate API token in Profile
2. Create some templates and forms
3. Test API endpoints with curl or Postman
4. Implement Odoo module to consume the API

### Power Automate
1. Configure OneDrive/Dropbox access
2. Create Power Automate flow
3. Submit support ticket via floating help button
4. Verify file upload and flow execution
5. Check email and mobile notifications

## Production Deployment

When deploying to production:
1. Ensure all environment variables are set
2. Configure proper SSL certificates
3. Set up proper authentication flows for cloud services
4. Test all integrations in production environment
5. Monitor logs for integration errors

## Integration Status

- ✅ Salesforce Integration - Complete
- ✅ API Token & External Access - Complete  
- ✅ Power Automate Support Tickets - Complete
- ✅ UI Components for all integrations - Complete
- ✅ Error handling and validation - Complete
- ✅ Internationalization support - Complete
