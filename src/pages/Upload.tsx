import React from 'react';
import FileUpload from '../components/FileUpload';
import { useNavigate } from 'react-router-dom';
import { Files } from 'lucide-react';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  
  const handleFileUploaded = (cid: string, filename: string) => {
    // After successful upload, wait a moment then offer to see file in the files list
    setTimeout(() => {
      const shouldViewFiles = window.confirm('File uploaded successfully! Would you like to view your files?');
      if (shouldViewFiles) {
        navigate('/files');
      }
    }, 1500);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Files to IPFS</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload your files to the InterPlanetary File System for decentralized storage and sharing.
        </p>
      </header>
      
      <div className="mb-10">
        <FileUpload onFileUploaded={handleFileUploaded} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-subtle border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
          <Files className="mr-2 text-primary-500" size={24} />
          Tips for IPFS Uploading
        </h2>
        
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mr-2 flex-shrink-0">1</span>
            <p>Files uploaded to IPFS are public and available to anyone with the correct CID.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mr-2 flex-shrink-0">2</span>
            <p>Content addressing means your file has the same CID no matter who uploads it.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mr-2 flex-shrink-0">3</span>
            <p>"Pinning" a file ensures it remains available on the network. Pin important files to prevent garbage collection.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mr-2 flex-shrink-0">4</span>
            <p>For better performance, large files are broken down into smaller chunks before being distributed.</p>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mr-2 flex-shrink-0">5</span>
            <p>IPFS supports any file type, but keep in mind public gateways may have limitations for very large files.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;