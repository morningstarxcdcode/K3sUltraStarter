import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { IPFSProvider } from './context/IPFSContext';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Files from './pages/Files';
import Learn from './pages/Learn';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <ThemeProvider>
      <IPFSProvider>
        <Router>
          <Layout isConnected={isConnected} setIsConnected={setIsConnected}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/files" element={<Files />} />
              <Route path="/learn" element={<Learn />} />
            </Routes>
          </Layout>
        </Router>
      </IPFSProvider>
    </ThemeProvider>
  );
}

export default App;