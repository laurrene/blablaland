import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForumPage from './components/ForumPage';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ForumPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inscription" element={<Login/>} />
        <Route path="/connexion" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;