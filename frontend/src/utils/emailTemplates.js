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
  HOT_LEAD: {
    name: 'Hot Lead Sequence',
    description: 'For leads with score 80+',
    emails: [
      {
        delay: 0, // Immediate
        template: 'hot_lead_immediate',
        subject: '🔥 Thanks for your interest - Let\'s talk today!',
        priority: 'high'
      },
      {
        delay: 60, // 1 hour if no response
        template: 'hot_lead_follow_up',
        subject: 'Quick question about your [INDUSTRY] goals',
        priority: 'high'
      },
      {
        delay: 1440, // 24 hours
        template: 'hot_lead_demo_offer',
        subject: 'Ready to see how [COMPANY] can save 40% on [PAIN_POINT]?',
        priority: 'medium'
      }
    ]
  },
  
  WARM_LEAD: {
    name: 'Warm Lead Sequence',
    description: 'For leads with score 60-79',
    emails: [
      {
        delay: 0,
        template: 'warm_lead_welcome',
        subject: 'Welcome! Here\'s what [INDUSTRY] leaders are doing',
        priority: 'medium'
      },
      {
        delay: 2880, // 48 hours
        template: 'warm_lead_case_study',
        subject: 'How [SIMILAR_COMPANY] increased efficiency by 60%',
        priority: 'medium'
      },
      {
        delay: 10080, // 1 week
        template: 'warm_lead_demo_invite',
        subject: 'Ready for a 15-min demo?',
        priority: 'medium'
      }
    ]
  },
  
  NURTURING: {
    name: 'Educational Nurturing',
    description: 'For leads with score 40-59',
    emails: [
      {
        delay: 0,
        template: 'nurturing_welcome',
        subject: 'Thanks for your interest in [SOLUTION]',
        priority: 'low'
      },
      {
        delay: 10080, // 1 week
        template: 'nurturing_educational',
        subject: '[INDUSTRY] Trends: What\'s changing in 2025?',
        priority: 'low'
      },
      {
        delay: 20160, // 2 weeks
        template: 'nurturing_tips',
        subject: '5 quick wins for [INDUSTRY] efficiency',
        priority: 'low'
      }
    ]
  }
};

/**
 * Email templates with dynamic content
 */
export const EMAIL_TEMPLATES = {
  // HOT LEAD TEMPLATES
  hot_lead_immediate: {
    subject: '🔥 Thanks for your interest - Let\'s talk today!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Hi {{firstName}},</h2>
        
        <p>I noticed you just submitted a form on our website - fantastic timing!</p>
        
        <p>Given that {{company}} is in the {{industry}} space with {{employeeRange}} employees, 
        I'd love to show you how companies like yours are:</p>
        
        <ul>
          <li>✅ Reducing operational costs by 30-40%</li>
          <li>✅ Improving team efficiency by 60%</li>
          <li>✅ Scaling without hiring additional staff</li>
        </ul>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Quick question:</strong> What's your biggest challenge with [SPECIFIC_PAIN_POINT] right now?</p>
        </div>
        
        <p>I have 15 minutes available today at 2 PM or 4 PM EST - would either work for a quick call?</p>
        
        <a href="{{calendlyLink}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          📅 Schedule 15-min Call
        </a>
        
        <p>Best regards,<br>
        {{senderName}}<br>
        {{senderTitle}}<br>
        {{senderPhone}}</p>
        
        <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          P.S. I sent this immediately because leads like yours typically see results within 30 days. 
          Happy to share a quick case study of a similar {{industry}} company if you're interested.
        </p>
      </div>
    `,
    variables: ['firstName', 'company', 'industry', 'employeeRange', 'calendlyLink', 'senderName', 'senderTitle', 'senderPhone']
  },

  hot_lead_follow_up: {
    subject: 'Quick question about your {{industry}} goals',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Hi {{firstName}},</h2>
        
        <p>I sent you a note earlier about {{company}}'s interest in our solution.</p>
        
        <p>I'm curious - what prompted you to look into this now? Are you:</p>
        
        <ul>
          <li>🎯 Planning for 2025 growth?</li>
          <li>⚡ Dealing with efficiency bottlenecks?</li>
          <li>💰 Under pressure to reduce costs?</li>
          <li>🔧 Looking to modernize processes?</li>
        </ul>
        
        <p>I ask because the approach I'd recommend depends on your specific situation.</p>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p><strong>Quick win:</strong> Even if we're not a fit, I can share a 5-minute framework 
          that most {{industry}} companies use to identify their biggest efficiency gains.</p>
        </div>
        
        <p>Worth a quick chat?</p>
        
        <a href="{{calendlyLink}}" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Yes, let's chat for 10 minutes
        </a>
        
        <p>{{senderName}}</p>
      </div>
    `,
    variables: ['firstName', 'company', 'industry', 'calendlyLink', 'senderName']
  },

  // WARM LEAD TEMPLATES
  warm_lead_welcome: {
    subject: 'Welcome! Here\'s what {{industry}} leaders are doing',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Welcome {{firstName}}!</h2>
        
        <p>Thanks for your interest in learning more about how we help {{industry}} companies like {{company}}.</p>
        
        <p>Here's what I'm seeing from {{industry}} leaders in 2025:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">📊 Industry Insights</h3>
          <ul>
            <li><strong>67% are prioritizing automation</strong> to handle growth without proportional hiring</li>
            <li><strong>52% are focusing on data integration</strong> to eliminate manual processes</li>
            <li><strong>79% plan to modernize</strong> at least one major workflow this year</li>
          </ul>
        </div>
        
        <p>I've attached a quick 2-page report showing the specific strategies that are working best for companies with {{employeeRange}} employees.</p>
        
        <p>Questions? Just reply to this email - I read every response personally.</p>
        
        <p>Best,<br>{{senderName}}</p>
        
        <p style="font-size: 12px; color: #6b7280;">
          P.S. If you're planning any process improvements for 2025, I'd be happy to share what's working for similar companies. 
          Takes about 10 minutes and might save you months of trial and error.
        </p>
      </div>
    `,
    variables: ['firstName', 'company', 'industry', 'employeeRange', 'senderName']
  },

  // NURTURING TEMPLATES
  nurturing_welcome: {
    subject: 'Thanks for your interest in {{solution}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Hello {{firstName}},</h2>
        
        <p>Welcome! I'm excited you're interested in learning more about improving {{company}}'s operations.</p>
        
        <p>Over the next few weeks, I'll share some valuable insights about:</p>
        
        <ul>
          <li>🎯 Best practices from successful {{industry}} companies</li>
          <li>📈 Industry benchmarks and trends</li>
          <li>💡 Quick wins you can implement immediately</li>
          <li>🛠️ Free tools and resources</li>
        </ul>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #065f46; margin-top: 0;">📚 Free Resource</h3>
          <p>To get started, here's our most popular guide: 
          <strong>"{{industry}} Efficiency Checklist: 15 Quick Wins"</strong></p>
          <a href="{{downloadLink}}" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Download Free Guide
          </a>
        </div>
        
        <p>Questions? Just reply - I love helping {{industry}} companies optimize their operations.</p>
        
        <p>Best regards,<br>{{senderName}}</p>
      </div>
    `,
    variables: ['firstName', 'company', 'industry', 'solution', 'downloadLink', 'senderName']
  }
};

/**
 * Dynamic content personalization
 */
export const personalizeEmail = (template, leadData, senderData = {}) => {
  let { html, subject } = EMAIL_TEMPLATES[template];
  
  // Default sender data
  const defaultSender = {
    senderName: 'Alex Rodriguez',
    senderTitle: 'Solutions Consultant',
    senderPhone: '+1 (555) 123-4567',
    calendlyLink: 'https://calendly.com/solutions-team/15min',
    downloadLink: 'https://yoursite.com/resources/guide'
  };
  
  const mergedSender = { ...defaultSender, ...senderData };
  const variables = { ...leadData, ...mergedSender };
  
  // Replace template variables
  EMAIL_TEMPLATES[template].variables.forEach(variable => {
    const regex = new RegExp(`{{${variable}}}`, 'g');
    const value = variables[variable] || `[${variable}]`;
    html = html.replace(regex, value);
    subject = subject.replace(regex, value);
  });
  
  // Add industry-specific pain points
  html = addIndustrySpecificContent(html, leadData.industry);
  
  return { html, subject };
};

/**
 * Add industry-specific content
 */
const addIndustrySpecificContent = (html, industry) => {
  const industryPainPoints = {
    technology: 'scaling development processes',
    healthcare: 'patient data management',
    finance: 'regulatory compliance automation',
    manufacturing: 'supply chain optimization',
    education: 'student information systems',
    retail: 'inventory and customer management'
  };
  
  const painPoint = industryPainPoints[industry?.toLowerCase()] || 'operational efficiency';
  return html.replace(/\[SPECIFIC_PAIN_POINT\]/g, painPoint);
};

/**
 * Get recommended email sequence based on lead score
 */
export const getEmailSequence = (leadScore) => {
  if (leadScore >= 80) return EMAIL_SEQUENCES.HOT_LEAD;
  if (leadScore >= 60) return EMAIL_SEQUENCES.WARM_LEAD;
  return EMAIL_SEQUENCES.NURTURING;
};

/**
 * Schedule email sequence
 */
export const scheduleEmailSequence = (leadData, leadScore) => {
  const sequence = getEmailSequence(leadScore);
  const scheduledEmails = [];
  
  sequence.emails.forEach((email, index) => {
    const sendTime = new Date(Date.now() + email.delay * 60000); // Convert minutes to milliseconds
    
    scheduledEmails.push({
      id: `${leadData.id || 'lead'}_${index}`,
      leadId: leadData.id,
      template: email.template,
      subject: email.subject,
      scheduledFor: sendTime,
      priority: email.priority,
      status: 'scheduled',
      sequenceName: sequence.name
    });
  });
  
  return scheduledEmails;
};

/**
 * Email analytics and tracking
 */
export const EMAIL_ANALYTICS = {
  // Track email performance
  trackEmail: (emailId, event, metadata = {}) => {
    const tracking = {
      emailId,
      event, // 'sent', 'opened', 'clicked', 'replied', 'bounced'
      timestamp: new Date(),
      metadata
    };
    
    // In a real implementation, this would send to analytics service
    console.log('Email tracking:', tracking);
    return tracking;
  },
  
  // Calculate sequence performance
  getSequenceMetrics: (sequenceName, timeframe = '30d') => {
    // Mock data - in real implementation, query from database
    return {
      sequenceName,
      timeframe,
      totalSent: 150,
      openRate: 0.45,
      clickRate: 0.12,
      replyRate: 0.08,
      conversionRate: 0.15,
      avgTimeToReply: '2.3 hours'
    };
  }
};

export default {
  EMAIL_CATEGORIES,
  EMAIL_SEQUENCES,
  EMAIL_TEMPLATES,
  personalizeEmail,
  getEmailSequence,
  scheduleEmailSequence,
  EMAIL_ANALYTICS
};
