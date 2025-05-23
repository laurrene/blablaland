import React from 'react';
import { Link } from 'react-router-dom';

// Composant lien vers un profil utilisateur
const UserLink = ({ email, children }) => {
  return (
    <Link to={`/profile/${email}`} className="user-link">
      {children || email}
    </Link>
  );
};

export default UserLink;
