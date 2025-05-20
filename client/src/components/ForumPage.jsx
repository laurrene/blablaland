import React, { useState, useRef } from 'react';
import '../styles/NavigationBar.css';
import '../styles/ForumPage.css';
import { Link } from 'react-router-dom';

const ForumPage = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [activeFormats, setActiveFormats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // Ajouté pour recherche
  const editorRef = useRef(null);

  const toggleFormat = (command) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    if (command === 'blockquote') {
      const isBlockquote = document.queryCommandValue('formatBlock') === 'blockquote';
      document.execCommand('formatBlock', false, isBlockquote ? 'div' : 'blockquote');

      const updated = [...activeFormats];
      if (isBlockquote) {
        setActiveFormats(updated.filter((c) => c !== command));
      } else {
        if (!updated.includes(command)) updated.push(command);
        setActiveFormats(updated);
      }
      return;
    }

    const isActive = document.queryCommandState(command);
    document.execCommand(command, false, null);

    const updated = [...activeFormats];
    if (isActive) {
      setActiveFormats(updated.filter((c) => c !== command));
      document.execCommand('removeFormat');
    } else {
      if (!updated.includes(command)) updated.push(command);
      setActiveFormats(updated);
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (title.trim() !== '' && message.trim() !== '') {
      const newPost = {
        id: Date.now(),
        user: 'Moi',
        title,
        content: message,
        timestamp: new Date(),
        comments: []
      };
      setMessages([newPost, ...messages]);
      setTitle('');
      setMessage('');
      setShowModal(false);
      setActiveFormats([]);
    }
  };

  const handleCommentChange = (e, postId) => {
    const value = e.target.value;
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === postId ? { ...msg, newComment: value } : msg
      )
    );
  };

  const handleAddComment = (postId) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.id === postId && msg.newComment && msg.newComment.trim() !== '') {
          const updatedComments = [
            ...msg.comments,
            {
              id: Date.now(),
              user: 'Moi',
              content: msg.newComment,
              timestamp: new Date()
            }
          ];
          return { ...msg, comments: updatedComments, newComment: '' };
        }
        return msg;
      })
    );
  };

  // Filtrer les messages en fonction de la recherche
  const filteredMessages = messages.filter(msg =>
    msg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="navbar">
        <Link to="/forum" className="logo">Blablaland</Link>
        <div className="nav-links">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/profile">Profil</Link>
          <Link to="/inscription">Inscription</Link>
          <Link to="/connexion">Connexion</Link>
        </div>
      </header>

      <main className="forum-main">
        <h3>Blabla partout, silence nulle part.</h3>

        <button className="create-post-btn" onClick={() => setShowModal(true)}>
          Créer un post
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Créer un nouveau sujet</h2>
              <form onSubmit={handlePost}>
                <div className="form-group">
                  <label htmlFor="title">Titre</label>
                  <input
                    type="text"
                    id="title"
                    className="title-input"
                    placeholder="Titre du sujet"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="editor-container">
                  <div className="editor-toolbar">
                    <button
                      type="button"
                      className={activeFormats.includes('bold') ? 'active' : ''}
                      onClick={() => toggleFormat('bold')}
                    >
                      <b>B</b>
                    </button>
                    <button
                      type="button"
                      className={activeFormats.includes('italic') ? 'active' : ''}
                      onClick={() => toggleFormat('italic')}
                    >
                      <i>I</i>
                    </button>
                    <button
                      type="button"
                      className={activeFormats.includes('strikeThrough') ? 'active' : ''}
                      onClick={() => toggleFormat('strikeThrough')}
                    >
                      <s>S</s>
                    </button>
                    <button
                      type="button"
                      className={activeFormats.includes('blockquote') ? 'active' : ''}
                      onClick={() => toggleFormat('blockquote')}
                    >
                      “”
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand('insertUnorderedList')}
                    >
                      •
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand('insertOrderedList')}
                    >
                      1.
                    </button>
                  </div>
                  <div
                    className="editor"
                    contentEditable
                    ref={editorRef}
                    onInput={() => setMessage(editorRef.current.innerHTML)}
                    placeholder="Contenu du message..."
                    suppressContentEditableWarning={true}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit">Publier</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="messages">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="message-thread">
              <div className="main-message">
                <div className="meta">
                  {msg.user} – {msg.timestamp.toLocaleString()}
                </div>
                <h3>{msg.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              </div>
              <div className="comments-thread">
                {msg.comments.map((c) => (
                  <div key={c.id} className="comment">
                    <div className="meta">
                      {c.user} – {c.timestamp.toLocaleString()}
                    </div>
                    <div>{c.content}</div>
                  </div>
                ))}
                <textarea
                  className="comment-input"
                  placeholder="Ajouter un commentaire..."
                  value={msg.newComment || ''}
                  onChange={(e) => handleCommentChange(e, msg.id)}
                />
                <button className="comment-btn" onClick={() => handleAddComment(msg.id)}>
                  Répondre
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ForumPage;
