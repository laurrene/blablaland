import React from 'react';
import UserLink from './UserLink';

const Comment = ({ comment, onDelete, currentUser, isAdmin }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <div className="meta">
          <UserLink email={comment.user}>{comment.user}</UserLink> – {new Date(comment.timestamp).toLocaleString()}
        </div>
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
      <div className="comment-content">{comment.content}</div>
    </div>
  );
};

export default Comment;