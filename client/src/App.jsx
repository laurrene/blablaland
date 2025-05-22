import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ForumPage from './components/ForumPage';
import Profile from './components/profile';
import SignUp from './components/SignUp';
import Login from './components/Login';
import SparkleCursor from './components/SparkleCursor';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('forumMessages');
    return saved ? JSON.parse(saved).map(m => ({
      ...m,
      timestamp: new Date(m.timestamp),
      comments: m.comments.map(c => ({ ...c, timestamp: new Date(c.timestamp) }))
    })) : [];
  });

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <SparkleCursor />
      <Routes>
        <Route path="/" element={<Navigate to="/forum" />} />
        <Route path="/forum" element={<ForumPage isLoggedIn={isLoggedIn} onLogout={handleLogout} messages={messages} setMessages={setMessages} />} />
        <Route path="/profile" element={<Profile messages={messages} setMessages={setMessages} />} />
        <Route path="/inscription" element={<SignUp />} />
        <Route 
          path="/connexion" 
          element={<Login setIsLoggedIn={setIsLoggedIn} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;