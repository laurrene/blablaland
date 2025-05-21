<<<<<<< HEAD
import React, { useState } from 'react';
import CommentForm from './CommentForm';
import '../styles/Topic.css'

const Topic = ({ msg, onComment, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(msg.isFavorite || false);

  const handleFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    if (onToggleFavorite) {
      onToggleFavorite(msg.id, newFavoriteStatus);
    }
  };

  return (
    <div className="message-thread">
      <div className="main-message">
        <div className="topic-header">
          <h3 className="topic-title">{msg.title}</h3>
          <button 
            className="favorite-button" 
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
=======
import React from 'react';
import CommentForm from './CommentForm';

const Topic = ({ msg, onComment }) => {
  return (
    <div className="message-thread">
      <div className="main-message">
        <h3 className="topic-title">{msg.title}</h3>
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
        <div className="meta">
          {msg.user} – {msg.timestamp.toLocaleString()}
        </div>
        <div>{msg.content}</div>
      </div>

      <div className="comments-thread">
        {msg.comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="meta">
              {comment.user} – {comment.timestamp.toLocaleString()}
            </div>
            <div>{comment.content}</div>
          </div>
        ))}

        <CommentForm onSubmit={(text) => onComment(msg.id, text)} />
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Topic;
=======
export default Topic;
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
