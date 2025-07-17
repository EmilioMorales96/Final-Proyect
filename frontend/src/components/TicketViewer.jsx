import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiRefreshCw, FiExternalLink, FiDownload, FiEye } from 'react-icons/fi';

const TicketViewer = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [dropboxFiles, setDropboxFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('local'); // 'local' or 'dropbox'

  // Fetch local tickets
  const fetchLocalTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/support/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Dropbox files
  const fetchDropboxFiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/support/dropbox-files', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDropboxFiles(data.files || []);
      } else {
        console.error('Failed to fetch Dropbox files');
      }
    } catch (error) {
      console.error('Error fetching Dropbox files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalTickets();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': 
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            🎫 {t('Support Tickets Manager')}
          </h2>
          <p className="text-gray-600 mt-1">
            {t('View and manage support tickets created by users')}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => {
                setActiveTab('local');
                fetchLocalTickets();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'local'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📁 {t('Local Tickets')} ({tickets.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('dropbox');
                fetchDropboxFiles();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dropbox'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ☁️ {t('Dropbox Files')} ({dropboxFiles.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Refresh Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                onClick={activeTab === 'local' ? fetchLocalTickets : fetchDropboxFiles}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{t('Refresh')}</span>
              </button>
              
              {activeTab === 'dropbox' && (
                <a
                  href="https://www.dropbox.com/home/Aplicaciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span>{t('Open Dropbox')}</span>
                </a>
              )}
            </div>
          </div>

          {/* Local Tickets Tab */}
          {activeTab === 'local' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">{t('Loading tickets...')}</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('No tickets found')}
                  </h3>
                  <p className="text-gray-600">
                    {t('Support tickets will appear here when users create them')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {ticket.id}
                          </h3>
                          <p className="text-gray-600">{ticket.summary}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">{t('Reported by')}:</span>
                          <p className="text-gray-600">{ticket.reportedBy}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{t('Template')}:</span>
                          <p className="text-gray-600">{ticket.template || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{t('Created')}:</span>
                          <p className="text-gray-600">{formatDate(ticket.createdAt)}</p>
                        </div>
                      </div>
                      
                      {ticket.link && (
                        <div className="mt-4">
                          <a 
                            href={ticket.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          >
                            <FiExternalLink className="w-4 h-4" />
                            <span>{t('View Page')}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dropbox Files Tab */}
          {activeTab === 'dropbox' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">{t('Loading Dropbox files...')}</p>
                </div>
              ) : dropboxFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">☁️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('No files in Dropbox')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('Support ticket files will appear here when uploaded to Dropbox')}
                  </p>
                  <a
                    href="https://www.dropbox.com/home/Aplicaciones"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>{t('Check Dropbox Manually')}</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-blue-800 font-medium mb-2">
                      📍 {t('Dropbox Location')}
                    </h4>
                    <p className="text-blue-700 text-sm">
                      {t('Files are stored in')}: <code className="bg-blue-100 px-2 py-1 rounded">
                        /Aplicaciones/FormsApp-PowerAutomate/FormsApp-Tickets/
                      </code>
                    </p>
                  </div>

                  {dropboxFiles.map((file, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            <span>{t('Size')}: {formatFileSize(file.size)}</span>
                            <span className="mx-2">•</span>
                            <span>{t('Modified')}: {formatDate(file.modified)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-green-600 rounded-md hover:bg-gray-100">
                            <FiDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketViewer;
