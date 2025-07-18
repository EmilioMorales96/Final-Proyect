/**
 * 📧 Automated Email Templates System
 * Professional email sequences based on lead scoring and behavior
 * Inspired by HubSpot Sequences and Salesforce Pardot
 */

/**
 * Email template categories
 */
export const EMAIL_CATEGORIES = {
  WELCOME: 'welcome',
  NURTURING: 'nurturing',
  FOLLOW_UP: 'follow_up',
  DEMO: 'demo',
  ENTERPRISE: 'enterprise',
  RE_ENGAGEMENT: 're_engagement'
};

/**
 * Lead score-based email sequences
 */
export const EMAIL_SEQUENCES = {
  WELCOME_SEQUENCE: {
    name: 'Welcome Sequence',
    description: 'Automated welcome emails for new users',
    emails: [
      {
        template: 'user_welcome',
        delayMinutes: 0
      },
      {
        template: 'user_onboarding',
        delayMinutes: 60
      }
    ]
  },
  PASSWORD_RESET_SEQUENCE: {
    name: 'Password Reset Sequence',
    description: 'Password reset instructions and follow-up',
    emails: [
      {
        template: 'password_reset',
        delayMinutes: 0
      },
      {
        template: 'password_reset_followup',
        delayMinutes: 1440 // 1 day
      }
    ]
  }
};

/**
 * Email templates with dynamic content
 */
export const EMAIL_TEMPLATES = {
  user_welcome: {
    subject: 'Welcome to our platform, {{firstName}}!',
    body: 'Hello {{firstName}},\n\nThank you for joining us! We are excited to have you on board.\n\nBest regards,\nThe Team',
    variables: ['firstName']
  },
  user_onboarding: {
    subject: 'Getting Started with Your Account',
    body: 'Hi {{firstName}},\n\nHere are some tips to get started: ...\n\nIf you need help, reply to this email.\n\nBest,\nSupport Team',
    variables: ['firstName']
  },
  password_reset: {
    subject: 'Password Reset Request',
    body: 'Hi {{firstName}},\n\nWe received a request to reset your password. Click the link below to proceed:\n{{resetLink}}\n\nIf you did not request this, please ignore this email.',
    variables: ['firstName', 'resetLink']
  },
  password_reset_followup: {
    subject: 'Need Help Resetting Your Password?',
    body: 'Hi {{firstName}},\n\nIf you need further assistance with your password reset, reply to this email.\n\nBest,\nSupport Team',
    variables: ['firstName']
  }
};

/**
 * Dynamic content personalization
 */
export const personalizeEmail = (template) => {
  // Only personalize real templates
  if (!EMAIL_TEMPLATES[template]) return { html: '', subject: '' };
};

// --- Email Automation System ---

// Categories for email templates
// (Removed duplicate EMAIL_CATEGORIES declaration)

// Email template structure
export class EmailTemplate {
  constructor({ id, name, category, subject, body, variables }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.subject = subject;
    this.body = body;
    this.variables = variables || [];
  }
}

// In-memory store for templates (replace with DB in production)
export const emailTemplatesStore = [];

// Create a new template
export function createEmailTemplate({ name, category, subject, body, variables }) {
  const id = Date.now().toString();
  const template = new EmailTemplate({ id, name, category, subject, body, variables });
  emailTemplatesStore.push(template);
  return template;
}

// Get all templates
export function getEmailTemplates() {
  return emailTemplatesStore;
}

// Find template by ID
export function getEmailTemplateById(id) {
  return emailTemplatesStore.find(t => t.id === id);
}

// Send email (dummy implementation, replace with real API)
export async function sendEmail({ to, templateId, variables = {}, sender = 'noreply@yourdomain.com' }) {
  const template = getEmailTemplateById(templateId);
  if (!template) throw new Error('Template not found');
  let subject = template.subject;
  let body = template.body;
  template.variables.forEach(variable => {
    const regex = new RegExp(`{{${variable}}}`, 'g');
    subject = subject.replace(regex, variables[variable] || '');
    body = body.replace(regex, variables[variable] || '');
  });
  // Simulate sending
  console.log(`Sending email to ${to} from ${sender}`);
  console.log('Subject:', subject);
  console.log('Body:', body);
  // Here you would call your backend/email service
  return { to, subject, body, sender, sent: true };
}

// Example usage (remove in production)
// createEmailTemplate({
//   name: 'Welcome',
//   category: 'welcome',
//   subject: 'Welcome, {{firstName}}!',
//   body: 'Hello {{firstName}}, thanks for joining!',
//   variables: ['firstName']
// });


/**
 * Get an email sequence by name or key
 */
export function getEmailSequence(sequenceKey) {
  return EMAIL_SEQUENCES[sequenceKey] || null;
}

/**
 * Schedule an email sequence for a lead (dummy implementation)
 * In production, this should trigger backend logic to schedule emails
 */
export async function scheduleEmailSequence({ sequenceKey, lead, variables = {}, sender = 'noreply@yourdomain.com' }) {
  const sequence = getEmailSequence(sequenceKey);
  if (!sequence) throw new Error('Sequence not found');
  // Simulate scheduling: return the sequence with personalized emails
  const scheduled = sequence.emails.map((step) => {
    const template = EMAIL_TEMPLATES[step.template];
    let subject = template.subject;
    let body = template.body;
    template.variables.forEach(variable => {
      const regex = new RegExp(`{{${variable}}}`, 'g');
      subject = subject.replace(regex, variables[variable] || lead[variable] || '');
      body = body.replace(regex, variables[variable] || lead[variable] || '');
    });
    return {
      to: lead.email,
      subject,
      body,
      sender,
      delayMinutes: step.delayMinutes
    };
  });
  return scheduled;
}

export default {
  EMAIL_CATEGORIES,
  createEmailTemplate,
  getEmailTemplates,
  getEmailTemplateById,
  sendEmail,
  getEmailSequence,
  scheduleEmailSequence
};
