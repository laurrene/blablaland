import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ForumPage from './components/ForumPage';
import Profile from './components/Profile'; 
import SignUp from './components/SignUp';
import Login from './components/Login';
import SparkleCursor from './components/SparkleCursor';
import './App.css';

function App() {
  // État pour savoir si l'utilisateur est connecté, initialisé depuis localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Stocke l'email de l'utilisateur connecté, depuis localStorage aussi
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || null;
  });

  // Messages (topics) du forum
  const [messages, setMessages] = useState([]);

  // États pour chargement et erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement des topics au montage du composant
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

  // Fonction pour déconnexion : nettoie localStorage et met à jour l'état
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  // Affiche un message pendant le chargement
  if (loading) return <div>Chargement...</div>;

  // Affiche un message d'erreur s'il y en a une
  if (error) return <div>Erreur: {error}</div>;

  return (
    // Routeur principal de l'app
    <Router>
      {/* Curseur personnalisé */}
      <SparkleCursor />
      
      {/* Définition des routes */}
      <Routes>
        {/* Redirection de la racine vers /forum */}
        <Route path="/" element={<Navigate to="/forum" />} />

        {/* Page principale du forum */}
        <Route 
          path="/forum" 
          element={
            <ForumPage 
              isLoggedIn={isLoggedIn} 
              onLogout={handleLogout} 
              messages={messages} 
              setMessages={setMessages}
              userEmail={userEmail}
            />
          } 
        />

        {/* Profil utilisateur, avec ou sans paramètre d'email */}
        <Route 
          path="/profile" 
          element={
            <Profile 
              isLoggedIn={isLoggedIn}
              messages={messages} 
              setMessages={setMessages}
              userEmail={userEmail}
            />
          } 
        />
        <Route 
          path="/profile/:email" 
          element={
            <Profile 
              isLoggedIn={isLoggedIn}
              messages={messages} 
              setMessages={setMessages}
              userEmail={userEmail}
            />
          } 
        />

        {/* Pages d'inscription et connexion */}
        <Route path="/inscription" element={<SignUp />} />
        <Route 
          path="/connexion" 
          element={
            <Login 
              setIsLoggedIn={setIsLoggedIn} 
              setUserEmail={setUserEmail}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
