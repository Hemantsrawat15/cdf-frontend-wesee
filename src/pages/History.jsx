import React from 'react';
import { Clock, FileText, Download, Eye } from 'lucide-react';

const History = () => {
  // Mock data for demonstration
  const historyItems = [
    {
      id: 1,
      filename: 'sales_data.csv',
      source: 'Database',
      subSource: 'MySQL',
      uploadDate: '2024-01-15 14:30',
      size: '2.4 MB',
      status: 'Completed',
    },
    {
      id: 2,
      filename: 'user_analytics.xlsx',
      source: 'API Endpoints',
      subSource: 'REST API',
      uploadDate: '2024-01-14 09:15',
      size: '1.8 MB',
      status: 'Completed',
    },
    {
      id: 3,
      filename: 'product_images.zip',
      source: 'Cloud Storage',
      subSource: 'AWS S3',
      uploadDate: '2024-01-13 16:45',
      size: '15.2 MB',
      status: 'Processing',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upload History
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View and manage your previously uploaded files and their processing status.
        </p>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-600" />
            Recent Uploads
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {historyItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.filename}</h3>
                    <p className="text-sm text-gray-600">
                      {item.source} • {item.subSource} • {item.size}
                    </p>
                    <p className="text-xs text-gray-500">{item.uploadDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>

                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {historyItems.length === 0 && (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upload history</h3>
            <p className="text-gray-600">Your uploaded files will appear here once you start uploading.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
