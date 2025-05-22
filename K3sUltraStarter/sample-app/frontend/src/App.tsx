import React, { useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${BACKEND_URL}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Failed to fetch from backend'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Sample React Frontend</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

function About() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>About</h1>
      <p>This is a sample app demonstrating React frontend with FastAPI backend.</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="/" style={{ marginRight: '10px' }}>Home</a>
        <a href="/about">About</a>
      </nav>
      <div>
        {window.location.pathname === '/' && <Home />}
        {window.location.pathname === '/about' && <About />}
      </div>
    </div>
  );
}

export default App;
