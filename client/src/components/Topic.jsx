import React, { useState } from 'react';
import CommentForm from './CommentForm';
import '../styles/Topic.css'

const Topic = ({ msg, onComment, onToggleFavorite, isLoggedIn }) => {
  const [isFavorite, setIsFavorite] = useState(msg.isFavorite || false);

  // Gestion du clic sur le bouton favori
  const handleFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    if (onToggleFavorite) {
      onToggleFavorite(msg.id, newFavoriteStatus);
    }
  };

  return (
    <div className="message-thread">
      {/* Message principal */}
      <div className="main-message">
        <div className="topic-header">
          <h3 className="topic-title">{msg.title}</h3>
          {/* Bouton favori visible si connecté */}
          {isLoggedIn && (
            <button 
              className="favorite-button" 
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          )}
        </div>
        <div className="meta">
          {msg.user} – {msg.timestamp.toLocaleString()}
        </div>
        <div>{msg.content}</div>
      </div>

      {/* Fil des commentaires */}
      <div className="comments-thread">
        {msg.comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="meta">
              {comment.user} – {comment.timestamp.toLocaleString()}
            </div>
            <div>{comment.content}</div>
          </div>
        ))}

        {/* Formulaire ajout commentaire */}
        <CommentForm onSubmit={(text) => onComment(msg.id, text)} />
      </div>
    </div>
  );
};

export default Topic;
