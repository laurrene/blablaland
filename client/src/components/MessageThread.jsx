import React from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import UserLink from './UserLink';

const MessageThread = ({ 
  msg, 
  isLoggedIn, 
  userEmail, 
  isAdmin, 
  handleToggleFavorite, 
  handleDeleteTopic, 
  handleAddComment, 
  handleDeleteComment 
}) => {
  return (
    <div key={msg._id} className="message-thread">
      <div className="topic-actions">
        {isLoggedIn && (
          <button
            className={`favorite-btn ${msg.isFavorite ? 'favorited' : ''}`}
            onClick={() => handleToggleFavorite(msg._id)}
            aria-label={msg.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {msg.isFavorite ? '★' : '☆'}
          </button>
        )}
        {(userEmail === msg.user || isAdmin) && (
          <button 
            className="delete-topic-btn"
            onClick={() => handleDeleteTopic(msg._id)}
            aria-label="Supprimer le topic"
          >
            Supprimer
          </button>
        )}
      </div>
      <div className="main-message">
        <div className="meta">
          <UserLink email={msg.user}>{msg.user}</UserLink> – {new Date(msg.timestamp).toLocaleString()}
        </div>
        <h3>{msg.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: msg.content }} />
      </div>
      <div className="comments-thread">
        {msg.comments.map((c) => (
          <Comment
            key={c.id}
            comment={c}
            onDelete={(commentId) => handleDeleteComment(msg._id, commentId)}
            currentUser={userEmail}
            isAdmin={isAdmin}
          />
        ))}
        {isLoggedIn && <CommentForm onSubmit={(newComment) => handleAddComment(msg._id, newComment)} />}
      </div>
    </div>
  );
};

export default MessageThread;