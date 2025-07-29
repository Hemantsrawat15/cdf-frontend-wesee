import React, { useEffect, useState } from 'react';
import { Clock, FileText, Download, Eye } from 'lucide-react';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8000/file-history");
        const data = await response.json();

        const formatted = data.map((item, index) => ({
          id: index + 1,
          filename: item.filename,
          uuid: item.uuid,
          timestamp: item.timestamp,
          source: item.source,
          content_type: item.content_type,
          size: (item.size / 1024).toFixed(1) + ' KB',
          status: 'Completed',
        }));

        setHistoryItems(formatted);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    fetchHistory();
  }, []);

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

  const handleDownload = async (uuid, filename) => {
    try {
      const response = await fetch(`http://localhost:8000/file/raw-data/${uuid}`);

      if (!response.ok) {
        throw new Error(`Failed to download file with UUID ${uuid}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  const handleDownloadStructuredCDF = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:8000/structured/cdf/download/${uuid}`);

      if (!response.ok) {
        throw new Error(`Failed to download structured CDF data for UUID ${uuid}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : `cdf_data_${uuid}.csv`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Structured CDF Download error:", error);
      alert("Failed to download structured CDF data.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upload History
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View and manage your previously uploaded files and their processing status.
        </p>
      </div>

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
                    <div>
                      <p className="text-sm text-gray-600">• Source: {item.source}</p>
                      <p className="text-sm text-gray-600">• Type: {item.content_type}</p>
                      <p className="text-sm text-gray-600 mb-1">• Size: {item.size}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      UUID: <span className="font-mono">{item.uuid}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded at: {item.timestamp}
                    </p>
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
                    <button
                      onClick={() => handleDownload(item.uuid, item.filename)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download Original File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadStructuredCDF(item.uuid)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                      title="Download Structured CDF (CSV)"
                    >
                      Download CDF
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
