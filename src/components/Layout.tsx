import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useIPFS } from '../context/IPFSContext';
import { 
  Home, Upload, Files, BookOpen, Sun, Moon, Database, 
  MenuIcon, X as CloseIcon, Settings, Globe, RefreshCw
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isConnected, setIsConnected }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { connectIPFS, isConnecting, connectionError } = useIPFS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customGateway, setCustomGateway] = useState('https://ipfs.io');

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/upload', label: 'Upload', icon: <Upload size={20} /> },
    { path: '/files', label: 'Files', icon: <Files size={20} /> },
    { path: '/learn', label: 'Learn', icon: <BookOpen size={20} /> },
  ];

  const handleConnect = async () => {
    try {
      await connectIPFS(customGateway);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-xl">IPFS Share</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`hidden md:flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                isConnected 
                  ? 'bg-success-500 hover:bg-success-600 text-white' 
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {isConnecting ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Database size={18} />
              )}
              <span>{isConnected ? 'Connected' : 'Connect to IPFS'}</span>
            </button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md animate-fade-in">
          <nav className="container mx-auto px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full mt-2 flex items-center justify-center space-x-1 px-4 py-3 rounded-md transition-colors ${
                isConnected 
                  ? 'bg-success-500 hover:bg-success-600 text-white' 
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {isConnecting ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Database size={18} />
              )}
              <span>{isConnected ? 'Connected' : 'Connect to IPFS'}</span>
            </button>
          </nav>
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute right-4 top-16 z-20 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-80 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">IPFS Settings</h3>
            <button 
              onClick={() => setShowSettings(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <CloseIcon size={18} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="gateway" className="block text-sm font-medium mb-1">
                IPFS Gateway
              </label>
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="gateway"
                    type="text"
                    value={customGateway}
                    onChange={(e) => setCustomGateway(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://ipfs.io"
                  />
                </div>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="ml-2 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
                >
                  {isConnecting ? <RefreshCw size={18} className="animate-spin" /> : "Connect"}
                </button>
              </div>
              {connectionError && (
                <p className="text-error-500 text-sm mt-1">{connectionError}</p>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connection Status: {isConnected ? (
                  <span className="text-success-500">Connected</span>
                ) : (
                  <span className="text-gray-500">Disconnected</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>IPFS File Sharing © {new Date().getFullYear()} - Decentralized Storage</p>
          <p className="mt-1">
            <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer" 
               className="text-primary-500 hover:underline">Learn more about IPFS</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;