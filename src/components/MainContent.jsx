import React from 'react';
import SourceSelection from './SourceSelection';
import FileUpload from './FileUpload';
import { Activity, Clock, FileText, Upload } from 'lucide-react';

const MainContent = ({
  activeTab,
  selectedSource,
  selectedSubSource,
  onSourceChange,
  onSubSourceChange,
  onFileSelect,
}) => {
  const historyItems = [
    {
      id: 1,
      source: 'Database',
      subSource: 'PostgreSQL',
      fileName: 'user_data_export.csv',
      timestamp: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      source: 'API Endpoints',
      subSource: 'REST API',
      fileName: 'sales_report.json',
      timestamp: '1 day ago',
      status: 'completed',
    },
    {
      id: 3,
      source: 'Cloud Storage',
      subSource: 'AWS S3',
      fileName: 'backup_files.zip',
      timestamp: '3 days ago',
      status: 'failed',
    },
  ];

  if (activeTab === 'history') {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Upload History</h1>
            </div>
            <p className="text-gray-600">View your recent file uploads and processing history</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {historyItems.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        item.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          item.status === 'completed' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900">{item.fileName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{item.source} → {item.subSource}</span>
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status === 'completed' ? 'Completed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 h-screen overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Common Data Format</h1>
          </div>
          <p className="text-gray-600">Configure your data sources and upload files for processing</p>
        </div>

        <div className="space-y-8">
          {/* Combined Source Configuration and File Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Source Configuration - 50% */}
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Configure Data Sources</h2>
                  <p className="text-gray-600">Select your primary data source and specify the sub-source type</p>
                </div>
                <SourceSelection
                  selectedSource={selectedSource}
                  selectedSubSource={selectedSubSource}
                  onSourceChange={onSourceChange}
                  onSubSourceChange={onSubSourceChange}
                />
              </div>

              {/* File Upload - 50% */}
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    File Upload
                  </h2>
                  <p className="text-gray-600">Upload your data files for processing and analysis</p>
                </div>
                <FileUpload onFileSelect={onFileSelect} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {(selectedSource || selectedSubSource) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to Process</h3>
                  <p className="text-gray-600">Your configuration is complete</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Save Configuration
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Start Processing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;