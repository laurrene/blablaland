import React, { useState } from 'react';
import '../styles/NavigationBar.css';
import '../styles/forum.css';

const ForumPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handlePost = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const newPost = {
        id: Date.now(),
        user: 'Moi',
        content: message,
        timestamp: new Date(),
        comments: []
      };
      setMessages([newPost, ...messages]);
      setMessage('');
    }
  };

  const handleComment = (postId, comment) => {
    setMessages(messages.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                user: 'Moi',
                content: comment,
                timestamp: new Date()
              }
            ]
          }
        : post
    ));
  };

  return (
    <div>
      <header className="navbar">
        <div className="logo">Blablaland</div>
        <div className="nav-links">
          <div className="search-bar">
            <input type="text" placeholder="Rechercher..." />
          </div>
          <a href="#profil">Profil</a>
          <a href="#deconnexion">Déconnexion</a>
        </div>
      </header>

      <main className="forum-main">
        <h1>Bienvenue sur le forum !</h1>
        <form className="post-form" onSubmit={handlePost}>
          <input
            type="text"
            placeholder="Écrivez un message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Poster</button>
        </form>

        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className="message-thread">
              <div className="main-message">
                <div className="meta">
                  {msg.user} – {msg.timestamp.toLocaleString()}
                </div>
                <div>{msg.content}</div>
              </div>

              {/* Section commentaires */}
              <div className="comments-thread">
                {msg.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="meta">
                      {comment.user} – {comment.timestamp.toLocaleString()}
                    </div>
                    <div>{comment.content}</div>
                  </div>
                ))}

                {/* Formulaire réponse */}
                <CommentForm onSubmit={(text) => handleComment(msg.id, text)} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// Composant formulaire de commentaire
const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Répondre..."
        className="comment-input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="comment-btn">Commenter</button>
    </form>
  );
};

export default ForumPage;
