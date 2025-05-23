import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavigationBar.css';

const NavigationBar = ({
  isLoggedIn,
  onLogout,
  searchTerm,
  setSearchTerm,
  searchAuthor,
  setSearchAuthor,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  // Composant barre de navigation avec recherche et liens selon statut connexion
  return (
    <header className="navbar">
      {/* Logo qui redirige vers le forum */}
      <Link to="/forum" className="logo">Blablaland</Link>

      <div className="nav-links">
        {/* Section de recherche avec filtres */}
        <div className="search-bar">
          <div className="search-bar-title">Recherche</div>
          
          {/* Recherche par titre et auteur */}
          <div className="search-row">
            <input 
              type="text" 
              placeholder="Titre..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Auteur..." 
              value={searchAuthor} 
              onChange={(e) => setSearchAuthor(e.target.value)} 
            />
          </div>

          {/* Recherche par plage de dates */}
          <div className="search-row">
            <div>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
              <div className="date-range-label">(inclus)</div>
            </div>
            <div>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
              <div className="date-range-label">(exclus)</div>
            </div>
          </div>
        </div>

        {/* Liens affichés selon si utilisateur connecté ou non */}
        {!isLoggedIn ? (
          <>
            <Link to="/inscription">Inscription</Link>
            <Link to="/connexion">Connexion</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profil</Link>
            <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </header>
  );
};

export default NavigationBar;
