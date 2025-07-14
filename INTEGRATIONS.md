# External Integrations Documentation

## Overview
This project implements three external integrations as required for the final submission. All integrations are fully functional and ready for demonstration.

## 1. Salesforce Integration

### Purpose
Create Salesforce Accounts and Contacts directly from user profiles in the application.

### Implementation
- **Frontend Component:** `SalesforceIntegration.jsx`
- **Backend Route:** `salesforce.routes.js`
- **Authentication:** Client Credentials Flow (OAuth 2.0)

### Features
- Modal form accessible from user profile
- Company information collection
- Automatic Account creation in Salesforce
- Contact creation linked to the Account
- Error handling and success notifications
- Internationalization support (EN/ES)

### Configuration Required
```env
SALESFORCE_INSTANCE_URL=https://your-domain.salesforce.com
SALESFORCE_CLIENT_ID=your_client_id
SALESFORCE_CLIENT_SECRET=your_client_secret
```

### API Endpoints
- `POST /api/salesforce/create-account` - Creates Account and Contact

### How It Works
1. User clicks "Create Salesforce Account" in their profile
2. Modal opens with company information form
3. On submit, data is sent to backend
4. Backend authenticates with Salesforce using Client Credentials
5. Creates Account with company data
6. Creates Contact linked to the Account with user data
7. Returns success/error response to frontend

## 2. Odoo Integration (External API)

### Purpose
Provide external systems (like Odoo) access to aggregated template and form data.

### Implementation
- **Frontend Component:** `ApiTokenManager.jsx`
- **Backend Route:** `external.routes.js`
- **Database:** Added `apiToken` field to User model
- **Authentication:** Token-based API access

### Features
- API token generation from user profile
- External endpoint for template data access
- Aggregated statistics and analytics
- Secure token-based authentication
- Ready for Odoo module integration

### API Endpoints
- `POST /api/users/generate-token` - Generates API token for user
- `GET /api/external/user-templates/:userId?token=API_TOKEN` - Returns aggregated data

### Data Structure
```json
{
  "user": {
    "id": 1,
    "username": "user@example.com",
    "name": "User Name"
  },
  "templates": [
    {
      "id": 1,
      "title": "Template Title",
      "description": "Description",
      "topic": "Education",
      "forms_count": 5,
      "average_responses": 12.4,
      "questions": [...]
    }
  ],
  "statistics": {
    "total_templates": 3,
    "total_forms": 15,
    "total_responses": 187
  }
}
```

### How It Works
1. User generates API token from their profile
2. External system (Odoo) makes authenticated requests
3. Backend validates token and returns aggregated data
4. Odoo can import this data for business intelligence

## 3. Power Automate Integration

### Purpose
Create support tickets that trigger automated workflows in Microsoft Power Automate.

### Implementation
- **Frontend Components:** `SupportTicket.jsx`, `FloatingHelpButton.jsx`
- **Backend Route:** `support.routes.js`
- **Cloud Integration:** OneDrive and Dropbox file upload

### Features
- Floating help button available on all pages
- Support ticket creation modal
- Priority selection (Low, Medium, High, Critical)
- Context-aware ticket data (current page, template)
- JSON file generation and cloud upload
- Ready for Power Automate triggers

### Configuration Required
```env
ONEDRIVE_ACCESS_TOKEN=your_onedrive_token
DROPBOX_ACCESS_TOKEN=your_dropbox_token
```

### API Endpoints
- `POST /api/support/create-ticket` - Creates ticket and uploads to cloud

### Ticket Data Structure
```json
{
  "ticket": {
    "id": "ticket_12345",
    "user_id": 1,
    "user_email": "user@example.com",
    "subject": "Issue with template creation",
    "description": "Detailed description of the issue",
    "priority": "High",
    "status": "Open",
    "created_at": "2025-07-14T10:30:00Z"
  },
  "context": {
    "page": "/templates/create",
    "template_id": 5,
    "user_agent": "Mozilla/5.0...",
    "timestamp": "2025-07-14T10:30:00Z"
  }
}
```

### Power Automate Flow Setup
1. **Trigger:** When file is created in OneDrive/Dropbox
2. **Parse JSON:** Extract ticket information
3. **Send Email:** Notify support team
4. **Create Task:** Add to project management system
5. **Send Notification:** Mobile/Teams notification

### How It Works
1. User clicks floating help button (available on all pages)
2. Modal opens with support ticket form
3. User fills description and selects priority
4. On submit, JSON file is created with ticket data
5. File is uploaded to OneDrive and/or Dropbox
6. Power Automate flow is triggered by file creation
7. Automated workflow processes the ticket

## Integration Testing

### Local Testing
1. Set up environment variables for all three integrations
2. Test each integration independently
3. Verify data flow and error handling
4. Check internationalization

### Production Testing
1. Configure real credentials in Render
2. Test with actual Salesforce Developer Org
3. Verify external API access with real tokens
4. Test Power Automate flow with real file uploads

## Security Considerations
- All API tokens are stored securely in environment variables
- No hardcoded credentials in source code
- Token-based authentication for external access
- Proper error handling without exposing sensitive data
- CORS configuration for frontend-backend communication

## Future Enhancements
- Rate limiting for API endpoints
- Advanced analytics for Odoo integration
- More complex Power Automate workflows
- Additional cloud storage providers
- Webhook support for real-time notifications
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
