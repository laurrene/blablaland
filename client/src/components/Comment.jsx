import React from 'react';
import UserLink from './UserLink';

const Comment = ({ comment, onDelete, currentUser, isAdmin }) => {
  // Composant affichant un commentaire individuel

  return (
    <div className="comment">
      {/* En-tête du commentaire avec utilisateur et date */}
      <div className="comment-header">
        <div className="meta">
          <UserLink email={comment.user}>{comment.user}</UserLink> – {new Date(comment.timestamp).toLocaleString()}
        </div>
        {/* Bouton supprimer visible si utilisateur courant ou admin */}
        {(currentUser === comment.user || isAdmin) && (
          <button 
            className="delete-comment-btn" 
            onClick={() => onDelete(comment.id)}
            aria-label="Supprimer le commentaire"
          >
            ×
          </button>
        )}
      </div>
      {/* Contenu du commentaire */}
      <div className="comment-content">{comment.content}</div>
    </div>
  );
};

export default Comment;
