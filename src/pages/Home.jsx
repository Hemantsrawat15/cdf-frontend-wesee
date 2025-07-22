import React from 'react';
import SourceSelection from '../components/SourceSelection';
import FileUpload from '../components/FileUpload';

const Home = ({
  selectedSource,
  selectedSubSource,
  onSourceChange,
  onSubSourceChange,
  onFileSelect,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Common Data Format
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload and process your data files with our advanced data formatting system. 
          Select your data source and upload files to get started.
        </p>
      </div>

      {/* Source Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Data Source</h2>
        <SourceSelection
          selectedSource={selectedSource}
          selectedSubSource={selectedSubSource}
          onSourceChange={onSourceChange}
          onSubSourceChange={onSubSourceChange}
        />
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Files</h2>
        <FileUpload
          onFileSelect={onFileSelect}
          selectedSource={selectedSource}
        />
      </div>
    </div>
  );
};

export default Home;
