import React from 'react';
import ForumPage from './components/ForumPage';
import SparkleCursor from './components/SparkleCursor';
import './App.css'; // Si tu veux ajouter des styles

function App() {
  return (
    <div className="app-container">
      <ForumPage />
      <SparkleCursor />
      
    </div>
  );
}

export default App;
