import { IPFSHTTPClient } from 'ipfs-http-client';
import { CID } from 'multiformats/cid';

const CACHE_KEY_PREFIX = 'ipfs-file-cache:';

export class IPFSService {
  private client: IPFSHTTPClient;
  private gateway: string;
  private cache: Cache | null = null;
  
  constructor(client: IPFSHTTPClient, gateway: string) {
    this.client = client;
    this.gateway = gateway;
  }
  
  async initialize() {
    try {
      this.cache = await caches.open('ipfs-files');
    } catch (error) {
      console.warn('Cache API not available, falling back to memory cache', error);
      // If Cache API is not available, we'll use in-memory caching
    }
  }
  
  async addFile(file: File): Promise<string> {
    try {
      // Convert File to buffer
      const buffer = await file.arrayBuffer();
      
      // Add to IPFS
      const result = await this.client.add(
        { path: file.name, content: buffer },
        { pin: true }
      );
      
      // Cache the file
      await this.cacheFile(result.cid.toString(), file);
      
      return result.cid.toString();
    } catch (error) {
      console.error('Error adding file to IPFS:', error);
      throw new Error('Failed to add file to IPFS');
    }
  }
  
  async getFile(cid: string): Promise<Blob> {
    // Try to get from cache first
    const cachedFile = await this.getFileFromCache(cid);
    if (cachedFile) {
      return cachedFile;
    }
    
    // If not in cache, fetch from IPFS
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }
      
      // Combine chunks into a single Uint8Array
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const content = new Uint8Array(totalLength);
      
      let offset = 0;
      for (const chunk of chunks) {
        content.set(chunk, offset);
        offset += chunk.length;
      }
      
      // Create a blob from the content
      const blob = new Blob([content]);
      
      // Cache the file
      await this.cacheFile(cid, blob);
      
      return blob;
    } catch (error) {
      console.error('Error fetching file from IPFS:', error);
      
      // Try retrieving from gateway as fallback
      const response = await fetch(`${this.gateway}/ipfs/${cid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file from IPFS or gateway');
      }
      
      const blob = await response.blob();
      
      // Cache the file
      await this.cacheFile(cid, blob);
      
      return blob;
    }
  }
  
  async pinFile(cid: string): Promise<void> {
    try {
      await this.client.pin.add(CID.parse(cid));
    } catch (error) {
      console.error('Error pinning file:', error);
      throw new Error('Failed to pin file');
    }
  }
  
  async unpinFile(cid: string): Promise<void> {
    try {
      await this.client.pin.rm(CID.parse(cid));
    } catch (error) {
      console.error('Error unpinning file:', error);
      throw new Error('Failed to unpin file');
    }
  }
  
  async getFileFromCache(cid: string): Promise<Blob | null> {
    if (this.cache) {
      try {
        const cachedResponse = await this.cache.match(cid);
        if (cachedResponse) {
          return await cachedResponse.blob();
        }
      } catch (error) {
        console.warn('Error accessing cache:', error);
      }
    }
    
    // Try localStorage fallback for smaller files
    try {
      const cachedData = localStorage.getItem(`${CACHE_KEY_PREFIX}${cid}`);
      if (cachedData) {
        // Parse the base64 data
        const { type, data } = JSON.parse(cachedData);
        const binaryData = atob(data);
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }
        return new Blob([bytes], { type });
      }
    } catch (error) {
      console.warn('Error accessing localStorage cache:', error);
    }
    
    return null;
  }
  
  private async cacheFile(cid: string, data: File | Blob): Promise<void> {
    // Use Cache API if available
    if (this.cache) {
      try {
        const response = new Response(data);
        await this.cache.put(cid, response);
        return;
      } catch (error) {
        console.warn('Error caching file using Cache API:', error);
      }
    }
    
    // Fallback to localStorage for smaller files (< 5MB)
    if (data.size < 5 * 1024 * 1024) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Content = base64data.split(',')[1];
          
          // Store in localStorage
          localStorage.setItem(`${CACHE_KEY_PREFIX}${cid}`, JSON.stringify({
            type: data.type,
            data: base64Content
          }));
        };
      } catch (error) {
        console.warn('Error caching file using localStorage:', error);
      }
    }
  }
  
  async clearCache(): Promise<void> {
    if (this.cache) {
      try {
        await this.cache.keys().then(keys => {
          keys.forEach(key => {
            this.cache?.delete(key);
          });
        });
      } catch (error) {
        console.warn('Error clearing Cache API cache:', error);
      }
    }
    
    // Clear localStorage cache
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
  
  async downloadFile(cid: string, filename: string): Promise<void> {
    const blob = await this.getFile(cid);
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    // Trigger the download
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  
  getGatewayUrl(cid: string): string {
    return `${this.gateway}/ipfs/${cid}`;
  }
}