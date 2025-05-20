import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './components/profile';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForumPage from './components/ForumPage';
import SparkleCursor from './components/SparkleCursor';
import './App.css';

function App() {
  return (
    <Router>
      <SparkleCursor />
      <Routes>
        <Route path="/" element={<ForumPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inscription" element={<SignUp/>} />
        <Route path="/connexion" element={<Login />} />
      </Routes>
    </Router>
    
  );
}

export default App;