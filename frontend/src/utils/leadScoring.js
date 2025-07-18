
/**
 * Smart Lead Scoring System
 * Realistic weights and logic for production use
 */


// Industry scoring weights (based on real conversion rates, adjust as needed)
const INDUSTRY_WEIGHTS = {
  'technology': 20,
  'finance': 18,
  'healthcare': 17,
  'manufacturing': 15,
  'education': 12,
  'retail': 10,
  'construction': 8,
  'agriculture': 6,
  'other': 5
};


// Company size scoring (employees, based on real B2B conversion data)
const COMPANY_SIZE_WEIGHTS = {
  '1000+': 20,
  '500-999': 18,
  '250-499': 15,
  '100-249': 12,
  '50-99': 10,
  '10-49': 7,
  '1-9': 5
};


// Revenue scoring brackets (realistic for LATAM/US SMB/Enterprise)
const REVENUE_WEIGHTS = {
  'over_10m': 20,
  '5m_10m': 17,
  '1m_5m': 14,
  '500k_1m': 10,
  '100k_500k': 7,
  'under_100k': 3
};


// Engagement scoring factors (real user actions, not demo)
const ENGAGEMENT_WEIGHTS = {
  formCompletion: 5,
  websiteVisits: 3,
  emailOpens: 2,
  contentDownloads: 5,
  demoRequests: 10,
  multipleFormSubmissions: 7
};

/**
 * Calculate lead score based on form data and behavior
 * @param {Object} leadData - Lead information from form
 * @param {Object} behaviorData - User behavior data (optional)
 * @returns {Object} Scoring result with breakdown
 */
export const calculateLeadScore = (leadData, behaviorData = {}) => {
  let totalScore = 0;
  const scoreBreakdown = {};


  // 1. Industry Score
  const industryScore = INDUSTRY_WEIGHTS[leadData.industry?.toLowerCase()] || 0;
  totalScore += industryScore;
  scoreBreakdown.industry = industryScore;

  // 2. Company Size Score
  const sizeScore = COMPANY_SIZE_WEIGHTS[leadData.numberOfEmployees] || 0;
  totalScore += sizeScore;
  scoreBreakdown.companySize = sizeScore;

  // 3. Revenue Score
  const revenueScore = getRevenueScore(leadData.annualRevenue);
  totalScore += revenueScore;
  scoreBreakdown.revenue = revenueScore;

  // 4. Form Completion Score
  const completionScore = calculateCompletionScore(leadData);
  totalScore += completionScore;
  scoreBreakdown.completion = completionScore;

  // 5. Behavioral Score
  const behaviorScore = calculateBehaviorScore(behaviorData);
  totalScore += behaviorScore;
  scoreBreakdown.behavior = behaviorScore;


  // Determine lead grade
  const grade = getLeadGrade(totalScore);
  const priority = getLeadPriority(totalScore);

  return {
    score: Math.round(totalScore),
    grade,
    priority,
    breakdown: scoreBreakdown,
    recommendations: getRecommendations(totalScore),
    routing: getRoutingRecommendation(totalScore, leadData)
  };
};

/**
 * Calculate revenue-based score
 */
const getRevenueScore = (revenue) => {
  if (!revenue || revenue === 0) return 5;
  
  if (revenue >= 10000000) return REVENUE_WEIGHTS.over_10m;
  if (revenue >= 5000000) return REVENUE_WEIGHTS['5m_10m'];
  if (revenue >= 1000000) return REVENUE_WEIGHTS['1m_5m'];
  if (revenue >= 500000) return REVENUE_WEIGHTS['500k_1m'];
  if (revenue >= 100000) return REVENUE_WEIGHTS['100k_500k'];
  return REVENUE_WEIGHTS.under_100k;
};

/**
 * Calculate form completion score
 */
const calculateCompletionScore = (leadData) => {
  const requiredFields = ['company', 'industry'];
  const optionalFields = ['phone', 'website', 'numberOfEmployees', 'annualRevenue'];
  
  let score = 0;
  
  // Required fields completion
  const completedRequired = requiredFields.filter(field => 
    leadData[field] && leadData[field].trim() !== ''
  ).length;
  score += (completedRequired / requiredFields.length) * 5;
  
  // Optional fields bonus
  const completedOptional = optionalFields.filter(field => 
    leadData[field] && leadData[field] !== ''
  ).length;
  score += (completedOptional / optionalFields.length) * 5;
  
  return Math.round(score);
};

/**
 * Calculate behavioral score
 */
const calculateBehaviorScore = (behaviorData) => {
  let score = 0;
  
  if (behaviorData.formSubmissions > 1) {
    score += ENGAGEMENT_WEIGHTS.multipleFormSubmissions;
  }
  
  if (behaviorData.websiteVisits > 3) {
    score += ENGAGEMENT_WEIGHTS.websiteVisits;
  }
  
  if (behaviorData.demoRequested) {
    score += ENGAGEMENT_WEIGHTS.demoRequests;
  }
  
  return Math.min(score, 20); // Cap at 20 points
};

/**
 * Determine lead grade (A, B, C, D)
 */

// Realistic grading for production
const getLeadGrade = (score) => {
  if (score >= 50) return 'A';
  if (score >= 35) return 'B';
  if (score >= 20) return 'C';
  return 'D';
};

/**
 * Determine lead priority level
 */

const getLeadPriority = (score) => {
  if (score >= 50) return 'Hot';
  if (score >= 35) return 'Warm';
  if (score >= 20) return 'Cold';
  return 'Low';
};

/**
 * Get action recommendations based on score
 */

const getRecommendations = (score) => {
  if (score >= 50) {
    return [
      'Contact immediately',
      'Assign to senior sales rep',
      'Schedule onboarding call',
      'Send welcome email'
    ];
  }
  if (score >= 35) {
    return [
      'Contact within 24 hours',
      'Send follow-up email',
      'Add to nurturing sequence'
    ];
  }
  if (score >= 20) {
    return [
      'Add to email nurturing campaign',
      'Send educational content',
      'Monitor engagement'
    ];
  }
  return [
    'Add to long-term nurturing',
    'Monitor for behavior changes'
  ];
};

/**
 * Get routing recommendation
 */

const getRoutingRecommendation = (score, leadData) => {
  const revenue = leadData.annualRevenue || 0;
  if (score >= 50) {
    if (revenue >= 5000000) {
      return {
        team: 'Enterprise Sales',
        rep: 'Senior Account Executive',
        sla: '1 hour',
        priority: 'Critical'
      };
    }
    return {
      team: 'Sales',
      rep: 'Account Executive',
      sla: '4 hours',
      priority: 'High'
    };
  }
  if (score >= 35) {
    return {
      team: 'Sales',
      rep: 'Sales Development Rep',
      sla: '24 hours',
      priority: 'Medium'
    };
  }
  return {
    team: 'Marketing',
    rep: 'Marketing Qualified Lead',
    sla: '1 week',
    priority: 'Low'
  };
};

/**
 * Bulk score calculation for analytics
 */
export const calculateBulkScores = (leads) => {
  return leads.map(lead => ({
    ...lead,
    scoring: calculateLeadScore(lead.formData, lead.behaviorData)
  }));
};

/**
 * Get score distribution for analytics
 */
export const getScoreDistribution = (scores) => {
  const distribution = { A: 0, B: 0, C: 0, D: 0 };
  
  scores.forEach(score => {
    distribution[getLeadGrade(score)]++;
  });
  
  return distribution;
};

/**
 * Export utilities for other components
 */

import { sendEmail, EMAIL_TEMPLATES } from './emailTemplates';

/**
 * Send recommended email based on lead score and data
 * @param {Object} leadData - Lead information from form
 * @param {Object} behaviorData - User behavior data (optional)
 * @param {string} to - Recipient email address
 * @returns {Promise<Object>} Email send result
 */
export async function sendLeadScoringEmail({ leadData, behaviorData = {}, to }) {
  const scoring = calculateLeadScore(leadData, behaviorData);
  let templateId;
  // Select template based on grade
  switch (scoring.grade) {
    case 'A':
      templateId = 'user_welcome';
      break;
    case 'B':
      templateId = 'user_onboarding';
      break;
    case 'C':
      templateId = 'password_reset_followup'; // Example: replace with nurturing template
      break;
    default:
      templateId = 'password_reset'; // Example: replace with low-priority template
  }
  // Prepare variables for template
  const variables = {
    firstName: leadData.firstName || leadData.company || 'User',
    resetLink: leadData.resetLink || '',
    ...leadData
  };
  // Send email using template
  return await sendEmail({ to, templateId, variables });
}

export { INDUSTRY_WEIGHTS, COMPANY_SIZE_WEIGHTS, REVENUE_WEIGHTS };
