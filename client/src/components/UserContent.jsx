// UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);

  // Imagine que tu as un mécanisme pour te connecter et récupérer cet email
  // Ici on simule juste une connexion simple
  const login = (userEmail) => {
    setEmail(userEmail);
  };

  const logout = () => {
    setEmail(null);
  };

  return (
    <UserContext.Provider value={{ email, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
