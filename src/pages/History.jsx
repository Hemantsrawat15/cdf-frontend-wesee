import React, { useEffect, useState } from 'react';
import { Clock, FileText, Download, Eye, X } from 'lucide-react';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [metadataModal, setMetadataModal] = useState({
    isOpen: false,
    data: null,
    uuid: null
  });

  function formatToDDMMYYYY_HHMMSS(dateString) {
  if (!dateString) return '';
  // Handles "YYYY-MM-DD HH:MM:SS"
  if (dateString.includes(' ')) {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year} ${timePart}`;
  }
  // Handles ISO strings
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear());
  const time = d.toTimeString().slice(0, 8);
  return `${day}/${month}/${year} ${time}`;
}

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8000/file-history");
        const data = await response.json();

        const formatted = data.map((item, index) => ({
          id: index + 1,
          filename: item.filename,
          uuid: item.uuid,
          timestamp: formatToDDMMYYYY_HHMMSS(item.timestamp),
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
      console.log(`Attempting to download file with UUID: ${uuid}`);
      const response = await fetch(`http://localhost:8000/file/raw-data/${uuid}`);

      if (!response.ok) {
        throw new Error(`Failed to download file with UUID ${uuid}. Status: ${response.status}`);
      }

      // Check if the response has content
      const contentLength = response.headers.get('content-length');
      console.log(`Content-Length: ${contentLength}`);

      const blob = await response.blob();
      console.log(`Blob size: ${blob.size} bytes`);

      if (blob.size === 0) {
        alert("Warning: The downloaded file appears to be empty. This might indicate an issue with the file on the server.");
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log(`Successfully downloaded file: ${filename}`);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download file: ${error.message}`);
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

  const handleViewMetadata = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:8000/file/metadata/${uuid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch metadata");
      }
      const data = await response.json();
      setMetadataModal({
        isOpen: true,
        data: data,
        uuid: uuid
      });
    } catch (error) {
      console.error("Metadata view failed:", error);
      alert("Failed to fetch metadata.");
    }
  };

  const closeMetadataModal = () => {
    setMetadataModal({
      isOpen: false,
      data: null,
      uuid: null
    });
  };

  const checkFileExists = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:8000/file/metadata/${uuid}`);
      if (response.ok) {
        const metadata = await response.json();
        console.log("File metadata:", metadata);
        return metadata;
      }
      return null;
    } catch (error) {
      console.error("Error checking file metadata:", error);
      return null;
    }
  };

  return (
    <div className="space-y-8">
             {/* Metadata Modal */}
       {metadataModal.isOpen && (
         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
           <div className="bg-black rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700">
                           <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">
                  File Metadata
                </h3>
                                <button
                  onClick={closeMetadataModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mr-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
             
                           <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-2">
                    <span className="font-semibold">UUID:</span> {metadataModal.uuid}
                  </p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <table className="w-full text-sm text-gray-200">
                    <tbody>
                      {metadataModal.data && Object.entries(metadataModal.data).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-700 last:border-b-0">
                          <td className="py-2 px-3 font-semibold text-gray-300 bg-gray-800 w-1/3">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </td>
                          <td className="py-2 px-3 break-words">
                            {typeof value === 'object' ? (
                              <pre className="whitespace-pre-wrap text-xs">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              String(value)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
             
                           <div className="flex justify-end p-6 border-t border-gray-700">
                <button
                  onClick={closeMetadataModal}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors -mt-3"
                >
                  Close
                </button>
              </div>
           </div>
         </div>
       )}

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
                    <button
                      onClick={() => handleViewMetadata(item.uuid)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View File Metadata"
                    >
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


