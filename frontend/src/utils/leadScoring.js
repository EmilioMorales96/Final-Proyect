/**
 * 🎯 Smart Lead Scoring System
 * Inspired by HubSpot and Salesforce Einstein
 * Automatically scores leads based on multiple factors
 */

// Industry scoring weights (based on conversion rates)
const INDUSTRY_WEIGHTS = {
  'technology': 25,
  'finance': 22,
  'healthcare': 20,
  'manufacturing': 18,
  'education': 15,
  'retail': 12,
  'construction': 10,
  'agriculture': 8,
  'other': 5
};

// Company size scoring (employees)
const COMPANY_SIZE_WEIGHTS = {
  '1000+': 30,
  '500-999': 25,
  '250-499': 20,
  '100-249': 15,
  '50-99': 12,
  '10-49': 8,
  '1-9': 5
};

// Revenue scoring brackets
const REVENUE_WEIGHTS = {
  'over_10m': 30,
  '5m_10m': 25,
  '1m_5m': 20,
  '500k_1m': 15,
  '100k_500k': 10,
  'under_100k': 5
};

// Engagement scoring factors
const ENGAGEMENT_WEIGHTS = {
  formCompletion: 10,
  websiteVisits: 5,
  emailOpens: 3,
  contentDownloads: 8,
  demoRequests: 20,
  multipleFormSubmissions: 15
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

  // 1. Industry Score (25% weight)
  const industryScore = INDUSTRY_WEIGHTS[leadData.industry?.toLowerCase()] || 5;
  totalScore += industryScore;
  scoreBreakdown.industry = industryScore;

  // 2. Company Size Score (30% weight)
  const sizeScore = COMPANY_SIZE_WEIGHTS[leadData.numberOfEmployees] || 5;
  totalScore += sizeScore;
  scoreBreakdown.companySize = sizeScore;

  // 3. Revenue Score (25% weight)
  const revenueScore = getRevenueScore(leadData.annualRevenue);
  totalScore += revenueScore;
  scoreBreakdown.revenue = revenueScore;

  // 4. Form Completion Score (10% weight)
  const completionScore = calculateCompletionScore(leadData);
  totalScore += completionScore;
  scoreBreakdown.completion = completionScore;

  // 5. Behavioral Score (10% weight)
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
const getLeadGrade = (score) => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};

/**
 * Determine lead priority level
 */
const getLeadPriority = (score) => {
  if (score >= 80) return 'Hot';
  if (score >= 60) return 'Warm';
  if (score >= 40) return 'Cold';
  return 'Low';
};

/**
 * Get action recommendations based on score
 */
const getRecommendations = (score) => {
  if (score >= 80) {
    return [
      'Contact within 1 hour',
      'Assign to senior sales rep',
      'Schedule executive demo',
      'Send premium welcome sequence',
      'Create opportunity in Salesforce'
    ];
  }
  
  if (score >= 60) {
    return [
      'Contact within 24 hours',
      'Send personalized follow-up',
      'Add to nurturing sequence',
      'Provide industry-specific content'
    ];
  }
  
  if (score >= 40) {
    return [
      'Add to email nurturing campaign',
      'Send educational content',
      'Monitor engagement',
      'Follow up in 1 week'
    ];
  }
  
  return [
    'Add to long-term nurturing',
    'Send quarterly newsletters',
    'Monitor for behavior changes'
  ];
};

/**
 * Get routing recommendation
 */
const getRoutingRecommendation = (score, leadData) => {
  const revenue = leadData.annualRevenue || 0;
  
  if (score >= 80) {
    if (revenue >= 5000000) {
      return {
        team: 'Enterprise Sales',
        rep: 'Senior Account Executive',
        sla: '1 hour',
        priority: 'Critical'
      };
    }
    return {
      team: 'Inside Sales',
      rep: 'Senior Sales Rep',
      sla: '2 hours',
      priority: 'High'
    };
  }
  
  if (score >= 60) {
    return {
      team: 'Inside Sales',
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
export { INDUSTRY_WEIGHTS, COMPANY_SIZE_WEIGHTS, REVENUE_WEIGHTS };
