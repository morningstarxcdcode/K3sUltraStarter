import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useIPFS } from '../context/IPFSContext';
import { Upload, Check, X, ExternalLink, FilePlus, Loader } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded?: (cid: string, filename: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const { addFile } = useIPFS();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedCid, setUploadedCid] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadedCid(null);
    
    try {
      // Currently only handling a single file upload
      const file = acceptedFiles[0];
      setUploadedFileName(file.name);
      
      const cid = await addFile(file);
      
      setUploadedCid(cid);
      setUploadSuccess(true);
      
      if (onFileUploaded) {
        onFileUploaded(cid, file.name);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file to IPFS. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [addFile, onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const resetUpload = () => {
    setUploadSuccess(false);
    setUploadedCid(null);
    setUploadedFileName(null);
    setUploadError(null);
  };

  return (
    <div className="w-full">
      {uploadSuccess && uploadedCid ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-success-50 dark:bg-success-900 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-success-500" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-center mb-4">File Uploaded Successfully!</h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Content Identifier (CID):</p>
            <p className="font-mono text-sm break-all">{uploadedCid}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <a
              href={`https://ipfs.io/ipfs/${uploadedCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-1 py-2 px-4 bg-primary-100 dark:bg-gray-700 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ExternalLink size={16} />
              <span>View on IPFS Gateway</span>
            </a>
            
            <button
              onClick={resetUpload}
              className="flex-1 flex items-center justify-center space-x-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FilePlus size={16} />
              <span>Upload Another File</span>
            </button>
          </div>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`dropzone border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive ? 'active border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 
            'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          } ${
            isDragAccept ? 'border-success-500 bg-success-50 dark:bg-success-900/10' : ''
          } ${
            isDragReject ? 'border-error-500 bg-error-50 dark:bg-error-900/10' : ''
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <Loader size={48} className="text-primary-500 animate-spin mb-4" />
            ) : (
              <Upload size={48} className="text-primary-500 mb-4" />
            )}
            
            <h3 className="text-xl font-semibold mb-2">
              {uploading ? 'Uploading to IPFS...' : 'Upload Files to IPFS'}
            </h3>
            
            {isDragActive ? (
              <p className="text-lg">Drop the file here...</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Drag & drop a file here, or click to select
              </p>
            )}
            
            {!uploading && (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Files are stored on the IPFS network and retrievable via content ID (CID)
              </p>
            )}
            
            {uploading && uploadedFileName && (
              <div className="mt-4 w-full max-w-md">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 flex items-center">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{uploadedFileName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Uploading to IPFS...</p>
                  </div>
                  <div className="ml-4">
                    <div className="h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="mt-4 p-3 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 rounded-md flex items-start">
          <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{uploadError}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;