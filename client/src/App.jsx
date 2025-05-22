import React, { useState, useEffect } from 'react';
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

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/topics');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Erreur lors du chargement des messages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;


  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <SparkleCursor />
      <Routes>
        <Route path="/" element={<Navigate to="/forum" />} />
        <Route 
          path="/forum" 
          element={
            <ForumPage 
              isLoggedIn={isLoggedIn} 
              onLogout={handleLogout} 
              messages={messages} 
              setMessages={setMessages} 
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Profile 
              isLoggedIn={isLoggedIn} 
              messages={messages} 
              setMessages={setMessages} 
            />
          } 
        />
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