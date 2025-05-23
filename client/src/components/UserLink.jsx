import React from 'react';
import { Link } from 'react-router-dom';

// Composant qui crée un lien vers le profil d'un utilisateur
// Prend deux props :
// - email: l'identifiant de l'utilisateur (utilisé dans l'URL)
// - children: contenu optionnel à afficher dans le lien (par défaut on affiche l'email)
const UserLink = ({ email, children }) => {
  return (
    // Lien qui pointe vers la route /profile/{email}
    // Si children est fourni, on l'affiche, sinon on affiche l'email
    <Link to={`/profile/${email}`} className="user-link">
      {children || email}
    </Link>
  );
};

export default UserLink;