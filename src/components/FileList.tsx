import React, { useState } from 'react';
import { useIPFS } from '../context/IPFSContext';
import { FileObject } from '../types';
import { 
  Download, ExternalLink, Pin, Trash2, Clock, RefreshCw,
  File as FileIcon, Image, FileText, FileAudio, FileVideo
} from 'lucide-react';

interface FileListProps {
  searchTerm?: string;
  sortBy?: 'name' | 'date' | 'size';
  sortDirection?: 'asc' | 'desc';
}

const FileList: React.FC<FileListProps> = ({ 
  searchTerm = '', 
  sortBy = 'date', 
  sortDirection = 'desc' 
}) => {
  const { files, downloadFile, pinFile, unpinFile } = useIPFS();
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isPinning, setIsPinning] = useState<string | null>(null);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={24} className="text-primary-500" />;
    if (type.startsWith('audio/')) return <FileAudio size={24} className="text-secondary-500" />;
    if (type.startsWith('video/')) return <FileVideo size={24} className="text-accent-500" />;
    if (type.startsWith('text/') || type.includes('document')) return <FileText size={24} className="text-gray-500" />;
    return <FileIcon size={24} className="text-gray-500" />;
  };

  const handleDownload = async (file: FileObject) => {
    try {
      setIsDownloading(file.cid);
      await downloadFile(file.cid, file.name);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleTogglePin = async (file: FileObject) => {
    try {
      setIsPinning(file.cid);
      if (file.isPinned) {
        await unpinFile(file.cid);
      } else {
        await pinFile(file.cid);
      }
    } catch (error) {
      console.error('Pin toggle error:', error);
    } finally {
      setIsPinning(null);
    }
  };

  return (
    <div className="w-full">
      {sortedFiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <FileIcon size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No files found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? `No files match "${searchTerm}"`
              : "Upload some files to get started"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFiles.map((file) => (
            <div 
              key={file.cid} 
              className="file-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="p-4 flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-base font-medium text-gray-900 dark:text-gray-100 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span title={formatDate(file.dateAdded)}>
                      {formatDate(file.dateAdded).split(' ')[0]}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate" title={file.cid}>
                      {file.cid}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between">
                <div>
                  {file.isPinned && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300">
                      <Pin size={12} className="mr-1" />
                      Pinned
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleTogglePin(file)}
                    className={`p-1.5 rounded-full transition-colors ${
                      file.isPinned
                        ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 hover:bg-success-200 dark:hover:bg-success-800'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                    }`}
                    aria-label={file.isPinned ? "Unpin file" : "Pin file"}
                    disabled={isPinning === file.cid}
                  >
                    {isPinning === file.cid ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Pin size={16} />
                    )}
                  </button>
                  
                  <a
                    href={`https://ipfs.io/ipfs/${file.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                    aria-label="View on IPFS gateway"
                  >
                    <ExternalLink size={16} />
                  </a>
                  
                  <button 
                    onClick={() => handleDownload(file)}
                    className="p-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                    aria-label="Download file"
                    disabled={isDownloading === file.cid}
                  >
                    {isDownloading === file.cid ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;