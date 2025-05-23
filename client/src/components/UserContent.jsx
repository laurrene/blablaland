import React, { createContext, useState, useContext } from 'react';

// Crée un contexte pour gérer l'état de l'utilisateur
const UserContext = createContext(null);

// Permet à tous les composants enfants d'accéder à l'état utilisateur
export const UserProvider = ({ children }) => {
  // État qui stocke l'email de l'utilisateur connecté (null si déconnecté)
  const [email, setEmail] = useState(null);

  // Fonction pour connecter un utilisateur (met à jour l'email)
  const login = (userEmail) => {
    setEmail(userEmail);
  };

  // Fonction pour déconnecter l'utilisateur (réinitialise l'email à null)
  const logout = () => {
    setEmail(null);
  };

  // Fournit l'email et les fonctions de login/logout via le contexte
  return (
    <UserContext.Provider value={{ email, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);