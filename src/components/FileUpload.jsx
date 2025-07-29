import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  File,
  X,
  Check,
  UploadCloud,
  FileText,
  Music,
  Video,
  FileImage,
  Folder,
} from "lucide-react";

const FileUpload = ({ onFileSelect, selectedSource }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedFileTypes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/svg+xml"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
    video: ["video/mp4", "video/webm", "video/ogg"],
    pdf: ["application/pdf"],
    csv: ["text/csv", "application/vnd.ms-excel"],
    excel: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  };

  

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getFileTypeCategory = (type) => {
    return Object.keys(acceptedFileTypes).find((cat) =>
      acceptedFileTypes[cat].includes(type)
    );
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const type = getFileTypeCategory(file.type);
      if (!type) {
        alert("Unsupported file type");
        return;
      }

      setSelectedFile(file);
      setFileType(type);
      onFileSelect([file]);

      if (type === "image" || type === "video") {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    },
    [onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const type = getFileTypeCategory(file.type);
      if (!type) {
        alert("Unsupported file type");
        return;
      }

      setSelectedFile(file);
      setFileType(type);
      onFileSelect([file]);

      if (type === "image" || type === "video") {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    },
    [onFileSelect]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("source", selectedSource || "");

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch("http://127.0.0.1:8000/upload/detect", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploading(false);
      setUploadProgress(100);
      setUploadedFilename(data.filename);

      if (fileType === "image") {
        setPreviewUrl(`http://localhost:5000/image/${data.filename}`);
      }
    } catch (err) {
      alert("Upload failed: " + err.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType("");
    setUploadedFilename(null);
    setUploadProgress(0);
    setUploading(false);
    onFileSelect([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileIcon = () => {
    const iconClass = "w-12 h-12";
    switch (fileType) {
      case "video":
        return <Video className={`${iconClass} text-red-500`} />;
      case "audio":
        return <Music className={`${iconClass} text-green-500`} />;
      case "pdf":
        return <FileText className={`${iconClass} text-orange-500`} />;
      case "csv":
      case "excel":
        return <File className={`${iconClass} text-blue-500`} />;
      case "image":
        return <FileImage className={`${iconClass} text-purple-500`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  if (!selectedFile) {
    return (
      <div className="w-full space-y-4">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all w-full ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*,audio/*,video/*,application/pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
          <div className="space-y-4 pointer-events-none">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                dragActive ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <UploadCloud
                className={`w-8 h-8 ${
                  dragActive ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-lg font-medium ${
                  dragActive ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {dragActive ? "Drop files here" : "Drag & Drop Files Here"}
              </p>
              <p className="text-gray-500 mt-1">or</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Folder className="w-4 h-4 mr-2" />
                Browse Files
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Supported: Images, Audio, Video, PDF, CSV, Excel
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 border-2 border-gray-200 flex-shrink-0">
              {fileType === "image" && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                renderFileIcon()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {selectedFile.name}
              </h3>
              <p className="text-sm text-gray-600">
                {formatFileSize(selectedFile.size)}
              </p>
              <p className="text-xs text-gray-500 uppercase">{fileType} File</p>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 w-full">
            {!uploading ? (
              <>
                <button
                  onClick={handleUpload}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Upload
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <div className="w-full space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">Uploading...</span>
                  <button
                    onClick={handleCancel}
                    disabled={uploadProgress > 90}
                    className="inline-flex items-center px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploadedFilename && fileType === "image" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 w-full">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                ✅ Upload Successful!
              </h3>
              <p className="text-green-700">Uploaded Image from MinIO</p>
            </div>
            <div className="mt-4">
              <img
                src={`http://localhost:5000/image/${uploadedFilename}`}
                alt="Uploaded"
                className="max-w-full max-h-72 mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;