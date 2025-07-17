import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiMail, 
  FiClock, 
  FiUsers, 
  FiSend, 
  FiEdit, 
  FiEye,
  FiBarChart,
  FiPlay,
  FiPause,
  FiSettings
} from 'react-icons/fi';
import { 
  EMAIL_SEQUENCES, 
  EMAIL_TEMPLATES, 
  personalizeEmail, 
  getEmailSequence,
  EMAIL_ANALYTICS 
} from '../utils/emailTemplates';

const EmailAutomationDashboard = ({ leads = [] }) => {
  const { t } = useTranslation();
  const [activeSequences, setActiveSequences] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    // Load active email sequences
    const loadSequences = () => {
      // Mock data - in real implementation, fetch from backend
      const sequences = leads.map(lead => {
        const scoring = { score: Math.floor(Math.random() * 100) }; // Mock scoring
        const sequence = getEmailSequence(scoring.score);
        
        return {
          id: `seq_${lead.id}`,
          leadId: lead.id,
          leadName: lead.company,
          sequence: sequence.name,
          currentStep: Math.floor(Math.random() * 3),
          totalSteps: sequence.emails.length,
          status: ['active', 'paused', 'completed'][Math.floor(Math.random() * 3)],
          nextEmail: new Date(Date.now() + Math.random() * 86400000), // Random next 24h
          openRate: Math.random(),
          clickRate: Math.random() * 0.3
        };
      });
      
      setActiveSequences(sequences);
    };

    const loadAnalytics = () => {
      // Load email performance analytics
      const mockAnalytics = {
        totalSent: 1250,
        openRate: 0.42,
        clickRate: 0.18,
        replyRate: 0.08,
        conversionRate: 0.12,
        sequences: Object.keys(EMAIL_SEQUENCES).map(key => 
          EMAIL_ANALYTICS.getSequenceMetrics(EMAIL_SEQUENCES[key].name)
        )
      };
      
      setAnalytics(mockAnalytics);
    };

    loadSequences();
    loadAnalytics();
  }, [leads]);

  const previewTemplate = (templateId, leadData = null) => {
    const sampleLead = leadData || {
      firstName: 'John',
      company: 'Acme Corp',
      industry: 'Technology',
      employeeRange: '100-249',
      calendlyLink: 'https://calendly.com/demo',
      senderName: 'Alex Rodriguez'
    };

    const preview = personalizeEmail(templateId, sampleLead);
    setPreviewData({ ...preview, templateId });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const MetricCard = ({ title, value, subtitle, icon, trend }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-sm text-green-600">
          <span>↗ {trend} from last month</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('emailAutomation.title')}</h2>
          <p className="text-gray-600">{t('emailAutomation.subtitle')}</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiSettings className="w-4 h-4" />
          <span>{t('emailAutomation.configure')}</span>
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title={t('emailAutomation.emailsSent')}
          value={analytics.totalSent?.toLocaleString()}
          icon={<FiMail className="w-6 h-6 text-blue-600" />}
          trend="+12%"
        />
        <MetricCard
          title={t('emailAutomation.openRate')}
          value={`${(analytics.openRate * 100).toFixed(1)}%`}
          subtitle={`${t('emailAutomation.industryAverage')}: 24%`}
          icon={<FiEye className="w-6 h-6 text-green-600" />}
          trend="+3.2%"
        />
        <MetricCard
          title={t('emailAutomation.clickRate')}
          value={`${(analytics.clickRate * 100).toFixed(1)}%`}
          subtitle={`${t('emailAutomation.industryAverage')}: 8%`}
          icon={<FiBarChart className="w-6 h-6 text-purple-600" />}
          trend="+5.1%"
        />
        <MetricCard
          title={t('emailAutomation.conversionRate')}
          value={`${(analytics.conversionRate * 100).toFixed(1)}%`}
          subtitle={t('emailAutomation.leadsToCustomers')}
          icon={<FiUsers className="w-6 h-6 text-orange-600" />}
          trend="+8.7%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sequences */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Active Sequences</h3>
            <span className="text-sm text-gray-600">{activeSequences.length} running</span>
          </div>

          <div className="space-y-4">
            {activeSequences.slice(0, 5).map((seq) => (
              <div key={seq.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {seq.status === 'active' ? (
                      <FiPlay className="w-5 h-5 text-green-600" />
                    ) : seq.status === 'paused' ? (
                      <FiPause className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <FiBarChart className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{seq.leadName}</p>
                    <p className="text-sm text-gray-600">{seq.sequence}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seq.status)}`}>
                    {seq.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Step {seq.currentStep + 1}/{seq.totalSteps}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {activeSequences.length === 0 && (
            <div className="text-center py-8">
              <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active email sequences</p>
            </div>
          )}
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {Object.keys(EMAIL_TEMPLATES).map((templateId) => {
              const template = EMAIL_TEMPLATES[templateId];
              return (
                <div key={templateId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{template.subject}</p>
                    <p className="text-sm text-gray-600">
                      {template.variables.length} variables
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => previewTemplate(templateId)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Preview"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-600"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sequence Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sequence Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Sequence</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Sent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Open Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Click Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Reply Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {analytics.sequences?.map((seq, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{seq.sequenceName}</td>
                  <td className="py-3 px-4 text-gray-600">{seq.totalSent}</td>
                  <td className="py-3 px-4 text-gray-600">{(seq.openRate * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-gray-600">{(seq.clickRate * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-gray-600">{(seq.replyRate * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-gray-600">{(seq.conversionRate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Email Preview</h3>
              <button 
                onClick={() => setPreviewData(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Email Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Subject:</p>
                <p className="font-semibold text-gray-900">{previewData.subject}</p>
              </div>

              {/* Email Body */}
              <div 
                className="p-6 max-h-64 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: previewData.html }}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setPreviewData(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <FiSend className="w-4 h-4" />
                <span>Send Test</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAutomationDashboard;
