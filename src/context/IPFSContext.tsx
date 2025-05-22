import React, { createContext, useState, useContext, useEffect } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { IPFSService } from '../services/ipfsService';
import { FileObject } from '../types';

interface IPFSContextType {
  ipfs: IPFSService | null;
  files: FileObject[];
  isConnecting: boolean;
  connectionError: string | null;
  connectIPFS: (gateway?: string) => Promise<void>;
  addFile: (file: File) => Promise<string>;
  pinFile: (cid: string) => Promise<boolean>;
  unpinFile: (cid: string) => Promise<boolean>;
  refreshFiles: () => Promise<void>;
  getFileFromCache: (cid: string) => Promise<Blob | null>;
  clearCache: () => Promise<void>;
  downloadFile: (cid: string, filename: string) => Promise<void>;
}

const IPFSContext = createContext<IPFSContextType | undefined>(undefined);

// Default IPFS gateway
const DEFAULT_GATEWAY = 'https://ipfs.io';

export const useIPFS = () => {
  const context = useContext(IPFSContext);
  if (context === undefined) {
    throw new Error('useIPFS must be used within an IPFSProvider');
  }
  return context;
};

export const IPFSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ipfs, setIpfs] = useState<IPFSService | null>(null);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connectIPFS = async (gateway = DEFAULT_GATEWAY) => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // In a real app, we'd connect to a local IPFS node if available,
      // falling back to HTTP client for public gateway
      const ipfsClient = ipfsHttpClient({
        host: gateway.replace(/^https?:\/\//, ''),
        port: 443,
        protocol: 'https',
      });
      
      const ipfsService = new IPFSService(ipfsClient, gateway);
      await ipfsService.initialize();
      
      setIpfs(ipfsService);
      
      // Load files from local storage cache
      const cachedFiles = localStorage.getItem('ipfs-files');
      if (cachedFiles) {
        setFiles(JSON.parse(cachedFiles));
      }
    } catch (error) {
      console.error('Failed to connect to IPFS:', error);
      setConnectionError('Failed to connect to IPFS gateway. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const addFile = async (file: File): Promise<string> => {
    if (!ipfs) throw new Error('IPFS not connected');
    
    try {
      const cid = await ipfs.addFile(file);
      
      const newFile: FileObject = {
        cid,
        name: file.name,
        size: file.size,
        type: file.type,
        lastAccessed: new Date().toISOString(),
        isPinned: false,
        dateAdded: new Date().toISOString(),
      };
      
      // Update files state and cache
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem('ipfs-files', JSON.stringify(updatedFiles));
      
      return cid;
    } catch (error) {
      console.error('Error adding file to IPFS:', error);
      throw new Error('Failed to add file to IPFS');
    }
  };

  const pinFile = async (cid: string): Promise<boolean> => {
    if (!ipfs) throw new Error('IPFS not connected');
    
    try {
      await ipfs.pinFile(cid);
      
      // Update file status in state
      const updatedFiles = files.map(file => 
        file.cid === cid ? { ...file, isPinned: true } : file
      );
      
      setFiles(updatedFiles);
      localStorage.setItem('ipfs-files', JSON.stringify(updatedFiles));
      
      return true;
    } catch (error) {
      console.error('Error pinning file:', error);
      return false;
    }
  };

  const unpinFile = async (cid: string): Promise<boolean> => {
    if (!ipfs) throw new Error('IPFS not connected');
    
    try {
      await ipfs.unpinFile(cid);
      
      // Update file status in state
      const updatedFiles = files.map(file => 
        file.cid === cid ? { ...file, isPinned: false } : file
      );
      
      setFiles(updatedFiles);
      localStorage.setItem('ipfs-files', JSON.stringify(updatedFiles));
      
      return true;
    } catch (error) {
      console.error('Error unpinning file:', error);
      return false;
    }
  };

  const refreshFiles = async (): Promise<void> => {
    if (!ipfs) throw new Error('IPFS not connected');
    
    try {
      // In a full implementation, we would fetch the list of files from IPFS
      // For now, we'll just use what's in our local cache
      const cachedFiles = localStorage.getItem('ipfs-files');
      if (cachedFiles) {
        setFiles(JSON.parse(cachedFiles));
      }
    } catch (error) {
      console.error('Error refreshing files:', error);
    }
  };

  const getFileFromCache = async (cid: string): Promise<Blob | null> => {
    if (!ipfs) throw new Error('IPFS not connected');
    return ipfs.getFileFromCache(cid);
  };

  const clearCache = async (): Promise<void> => {
    if (!ipfs) throw new Error('IPFS not connected');
    await ipfs.clearCache();
  };

  const downloadFile = async (cid: string, filename: string): Promise<void> => {
    if (!ipfs) throw new Error('IPFS not connected');
    await ipfs.downloadFile(cid, filename);
    
    // Update last accessed timestamp
    const updatedFiles = files.map(file => 
      file.cid === cid ? { ...file, lastAccessed: new Date().toISOString() } : file
    );
    
    setFiles(updatedFiles);
    localStorage.setItem('ipfs-files', JSON.stringify(updatedFiles));
  };

  // Connect to IPFS on component mount
  useEffect(() => {
    connectIPFS();
  }, []);

  return (
    <IPFSContext.Provider value={{
      ipfs,
      files,
      isConnecting,
      connectionError,
      connectIPFS,
      addFile,
      pinFile,
      unpinFile,
      refreshFiles,
      getFileFromCache,
      clearCache,
      downloadFile,
    }}>
      {children}
    </IPFSContext.Provider>
  );
};