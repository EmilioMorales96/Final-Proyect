import nodemailer from 'nodemailer';

// Create reusable transporter object using the default SMTP transport
let transporter;

try {
  // Para desarrollo, usar un servicio de prueba como Ethereal
  // En producción, usar un servicio real como Gmail, SendGrid, etc.
  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASS || 'ethereal.pass'
    }
  });
} catch (error) {
  console.warn('Email service not configured properly. Email notifications will be disabled.');
  transporter = null;
}

/**
 * Send form submission confirmation email to user
 * @param {string} userEmail - User's email address
 * @param {Object} formData - Form submission data
 * @param {Object} template - Template information
 */
export const sendFormSubmissionEmail = async (userEmail, formData, template) => {
  if (!transporter) {
    console.warn('Email service not available. Skipping email notification.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    // Format answers for display
    const answersHtml = Object.entries(formData.answers)
      .map(([question, answer]) => {
        const answerValue = Array.isArray(answer) ? answer.join(', ') : answer;
        return `
          <div style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 6px;">
            <strong style="color: #495057;">${question}:</strong>
            <div style="margin-top: 4px; color: #6c757d;">${answerValue}</div>
          </div>
        `;
      })
      .join('');

    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Forms App" <noreply@formsapp.com>',
      to: userEmail,
      subject: `📋 Form Submission Confirmation - ${template.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Form Submission Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin-bottom: 8px;">📋 Form Submitted Successfully!</h1>
            <p style="color: #6b7280; margin: 0;">Thank you for your submission</p>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 8px 0; font-size: 20px;">${template.title}</h2>
            <p style="margin: 0; opacity: 0.9;">${template.description || 'No description provided'}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="color: #374151; margin-bottom: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📝 Your Responses</h3>
            ${answersHtml}
          </div>

          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h4 style="color: #0c4a6e; margin: 0 0 8px 0;">📅 Submission Details</h4>
            <p style="margin: 0; color: #075985;">
              <strong>Submitted on:</strong> ${new Date(formData.createdAt || Date.now()).toLocaleString()}<br>
              <strong>Form ID:</strong> #${formData.id || 'Generated'}
            </p>
          </div>

          <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-top: 30px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              This is an automated message. Please do not reply to this email.<br>
              If you have any questions, please contact our support team.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Forms App. All rights reserved.
            </p>
          </div>

        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully'
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

/**
 * Test email configuration
 */
export const testEmailService = async () => {
  if (!transporter) {
    return { success: false, message: 'Email service not configured' };
  }

  try {
    await transporter.verify();
    return { success: true, message: 'Email service is working correctly' };
  } catch (error) {
    return { success: false, message: `Email service error: ${error.message}` };
  }
};

export default {
  sendFormSubmissionEmail,
  testEmailService
};
