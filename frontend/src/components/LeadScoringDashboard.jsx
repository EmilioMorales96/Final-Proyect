import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiTarget, 
  FiTrendingUp, 
  FiUsers, 
  FiDollarSign,
  FiAward,
  FiBriefcase,
  FiMail,
  FiClock,
  FiChevronRight
} from 'react-icons/fi';
import { calculateLeadScore, getScoreDistribution } from '../utils/leadScoring';
import { getEmailSequence, scheduleEmailSequence } from '../utils/emailTemplates';

const LeadScoringDashboard = ({ leads = [], onLeadSelect }) => {
  const { t } = useTranslation();
  const [scoredLeads, setScoredLeads] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    // Calculate scores for all leads
    const scored = leads.map(lead => {
      const scoring = calculateLeadScore(lead, lead.behaviorData);
      const emailSequence = getEmailSequence(scoring.score);
      
      return {
        ...lead,
        scoring,
        emailSequence,
        scheduledEmails: scheduleEmailSequence(lead, scoring.score)
      };
    });

    setScoredLeads(scored);

    // Calculate distribution
    const scores = scored.map(lead => lead.scoring.score);
    setScoreDistribution(getScoreDistribution(scores));
  }, [leads]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Hot': return <FiTarget className="w-4 h-4 text-red-500" />;
      case 'Warm': return <FiTrendingUp className="w-4 h-4 text-orange-500" />;
      case 'Cold': return <FiClock className="w-4 h-4 text-yellow-500" />;
      default: return <FiUsers className="w-4 h-4 text-gray-500" />;
    }
  };

  const ScoreCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const LeadCard = ({ lead, onClick }) => (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(lead)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getScoreColor(lead.scoring.score)}`}>
            {lead.scoring.grade}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{lead.company}</h3>
            <p className="text-sm text-gray-600">{lead.industry}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getPriorityIcon(lead.scoring.priority)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.scoring.score)}`}>
            {lead.scoring.score}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{lead.scoring.routing.team}</span>
        <span className="flex items-center">
          <FiMail className="w-4 h-4 mr-1" />
          {lead.emailSequence.name}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('leadScoring.title')}</h2>
          <p className="text-gray-600">{t('leadScoring.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FiTarget className="w-4 h-4" />
          <span>{scoredLeads.length} {t('leadScoring.leadsAnalyzed')}</span>
        </div>
      </div>

      {/* Score Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ScoreCard
          title={t('leadScoring.hotLeads')}
          value={scoreDistribution.A}
          icon={<FiTarget className="w-6 h-6" />}
          color="text-red-600"
          subtitle={t('leadScoring.scoreRange.hot')}
        />
        <ScoreCard
          title={t('leadScoring.warmLeads')}
          value={scoreDistribution.B}
          icon={<FiTrendingUp className="w-6 h-6" />}
          color="text-orange-600"
          subtitle={t('leadScoring.scoreRange.warm')}
        />
        <ScoreCard
          title={t('leadScoring.coldLeads')}
          value={scoreDistribution.C}
          icon={<FiClock className="w-6 h-6" />}
          color="text-yellow-600"
          subtitle={t('leadScoring.scoreRange.cold')}
        />
        <ScoreCard
          title={t('leadScoring.lowPriority')}
          value={scoreDistribution.D}
          icon={<FiUsers className="w-6 h-6" />}
          color="text-gray-600"
          subtitle={t('leadScoring.scoreRange.low')}
        />
      </div>

      {/* Recent High-Score Leads */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('leadScoring.priorityLeads')}</h3>
          <span className="text-sm text-gray-600">{t('leadScoring.requiresAttention')}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoredLeads
            .filter(lead => lead.scoring.score >= 60)
            .sort((a, b) => b.scoring.score - a.scoring.score)
            .slice(0, 6)
            .map((lead, index) => (
              <LeadCard 
                key={index} 
                lead={lead} 
                onClick={setSelectedLead}
              />
            ))}
        </div>
        
        {scoredLeads.filter(lead => lead.scoring.score >= 60).length === 0 && (
          <div className="text-center py-8">
            <FiTarget className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('leadScoring.noHighPriority')}</p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t('leadScoring.leadDetails')}</h3>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Company Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Company:</strong> {selectedLead.company}</p>
                  <p><strong>Industry:</strong> {selectedLead.industry}</p>
                  <p><strong>Employees:</strong> {selectedLead.numberOfEmployees}</p>
                  <p><strong>Revenue:</strong> ${selectedLead.annualRevenue?.toLocaleString()}</p>
                </div>
              </div>

              {/* Scoring Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Industry:</span>
                    <span>{selectedLead.scoring.breakdown.industry}pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Size:</span>
                    <span>{selectedLead.scoring.breakdown.companySize}pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span>{selectedLead.scoring.breakdown.revenue}pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Form Completion:</span>
                    <span>{selectedLead.scoring.breakdown.completion}pts</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Score:</span>
                    <span className={getScoreColor(selectedLead.scoring.score)}>
                      {selectedLead.scoring.score}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Action Recommendations</h4>
              <ul className="space-y-2">
                {selectedLead.scoring.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <FiChevronRight className="w-4 h-4 text-blue-500 mr-2" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Sequence */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Scheduled Email Sequence</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{selectedLead.emailSequence.name}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {selectedLead.emailSequence.description}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  {selectedLead.scheduledEmails.length} emails scheduled
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => onLeadSelect && onLeadSelect(selectedLead)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View in Salesforce
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScoringDashboard;
