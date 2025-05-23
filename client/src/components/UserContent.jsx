import React, { createContext, useState, useContext } from 'react';

// Contexte utilisateur
const UserContext = createContext(null);

// Provider pour l'état utilisateur
export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);

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
