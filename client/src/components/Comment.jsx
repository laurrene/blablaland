import React from 'react';

const Comment = ({ comment, onDelete, currentUser }) => {
  return (
    <div className="comment">
      <div className="comment-header">
        <div className="meta">
          {comment.user} – {new Date(comment.timestamp).toLocaleString()}
        </div>
        {currentUser === comment.user && (
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