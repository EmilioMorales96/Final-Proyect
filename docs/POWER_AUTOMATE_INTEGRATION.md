# Power Automate Integration Setup Guide

## Overview
This implementation creates support tickets as JSON files and uploads them to OneDrive/Dropbox for Power Automate processing.

## 🎯 **Integration Flow**

### 1. Frontend → Backend → Cloud Storage
```
User clicks Help → Fills support form → Backend creates JSON → Uploads to OneDrive/Dropbox
```

### 2. Power Automate Flow Detection
```
OneDrive/Dropbox trigger → Read JSON → Parse data → Send emails → Mobile notification
```

## 🔧 **Backend Implementation**

### Support Ticket JSON Structure
```json
{
  "id": "TICKET-1642345678901-user123",
  "reportedBy": "user@example.com",
  "userId": 123,
  "template": "Customer Feedback Form",
  "link": "http://localhost:5173/forms/fill/15",
  "priority": "High",
  "summary": "Unable to submit form - getting validation errors",
  "admins": ["admin@formsapp.com", "support@formsapp.com"],
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-07-16T12:00:00.000Z",
  "page": "/forms/fill/15",
  "referrer": "http://localhost:5173/dashboard",
  "createdAt": "2025-07-16T12:00:00.000Z",
  "status": "Open"
}
```

### API Endpoints
- `POST /api/support/create-ticket` - Creates support ticket
- `GET /api/support/tickets` - Lists tickets (admin only)

## ☁️ **Cloud Storage Configuration**

### OneDrive (Microsoft Graph API)
```bash
# .env configuration
ONEDRIVE_ACCESS_TOKEN=your_token_here
```

**Setup Steps:**
1. Register app in Azure AD: https://portal.azure.com
2. Grant permissions: `Files.ReadWrite`
3. Get access token via OAuth flow
4. Files uploaded to: `/FormsApp-Tickets/`

### Dropbox API (Alternative)
```bash
# .env configuration
DROPBOX_ACCESS_TOKEN=your_token_here
```

**Setup Steps:**
1. Create app: https://www.dropbox.com/developers/apps
2. Generate access token
3. Files uploaded to: `/FormsApp-Tickets/`

## 🤖 **Power Automate Flow Setup**

### Trigger: OneDrive File Created
```
When a file is created (V2)
├── Site Address: OneDrive
├── Folder: /FormsApp-Tickets
└── Include subfolders: No
```

### Action 1: Get File Content
```
Get file content
├── File: [Dynamic content from trigger]
└── Output: JSON string
```

### Action 2: Parse JSON
```
Parse JSON
├── Content: [File content from previous step]
└── Schema: [Support ticket JSON schema]
```

### Action 3: Send Email (Gmail/Outlook)
```
Send an email (V2)
├── To: [admins array from JSON]
├── Subject: "[PRIORITY] Support Ticket: [summary]"
└── Body: [Formatted HTML with all ticket details]
```

### Action 4: Mobile Notification
```
Send me a mobile notification
├── Text: "New [priority] support ticket from [reportedBy]"
└── Link: [link from JSON]
```

## 📧 **Email Template Example**

```html
<h2>🎫 New Support Ticket</h2>
<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <td><strong>Priority:</strong></td>
    <td style="color: red;">[priority]</td>
  </tr>
  <tr>
    <td><strong>Reported by:</strong></td>
    <td>[reportedBy]</td>
  </tr>
  <tr>
    <td><strong>Template:</strong></td>
    <td>[template]</td>
  </tr>
  <tr>
    <td><strong>Page:</strong></td>
    <td><a href="[link]">[page]</a></td>
  </tr>
  <tr>
    <td><strong>Summary:</strong></td>
    <td>[summary]</td>
  </tr>
  <tr>
    <td><strong>Created:</strong></td>
    <td>[timestamp]</td>
  </tr>
</table>
```

## 🧪 **Testing the Integration**

### 1. Test Frontend
- Navigate to any page in the app
- Click the floating help button (blue circle, bottom-right)
- Fill out the support form
- Submit ticket

### 2. Verify Backend
- Check `/uploads/tickets/` directory for JSON files
- Check server logs for upload status
- Test API endpoints with Postman

### 3. Test Power Automate
- Monitor OneDrive/Dropbox for new files
- Verify flow triggers automatically
- Check email delivery
- Verify mobile notifications

## 🔐 **Security Considerations**

- API tokens stored in environment variables
- User authentication required for ticket creation
- Admin-only access to ticket listing
- File upload directory restricted
- Sensitive data excluded from logs

## 🚀 **Production Deployment**

### Environment Variables (Render)
```bash
ONEDRIVE_ACCESS_TOKEN=your_production_token
DROPBOX_ACCESS_TOKEN=your_fallback_token
ADMIN_EMAILS=admin@yourdomain.com,support@yourdomain.com
```

### File Storage
- Production files stored in cloud storage
- Local uploads/ directory as backup
- Automatic cleanup of old tickets (optional)

## 📱 **Demo Video Checklist**

1. ✅ Show user creating support ticket
2. ✅ Show JSON file created and uploaded
3. ✅ Show Power Automate flow triggered
4. ✅ Show formatted email received
5. ✅ Show mobile notification on phone
6. ✅ Show admin viewing tickets (optional)

## 🎬 **Video Recording Notes**

- **No voice narration required**
- Screen record the entire flow
- Include phone screen for mobile notification
- Show timestamps to prove real-time processing
- Demonstrate different priority levels
- Show both English and Spanish UI (optional)

---

**Implementation Status: ✅ COMPLETE**
- Frontend support ticket component ✅
- Backend API endpoints ✅
- Cloud storage upload ✅
- Floating help button on all pages ✅
- Bilingual support (EN/ES) ✅
- Ready for Power Automate flow setup ✅
