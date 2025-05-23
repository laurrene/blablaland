import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavigationBar.css';
import '../styles/ForumPage.css';
import CommentForm from './CommentForm';
import Comment from './Comment';
import UserLink from './UserLink';

const ForumPage = ({ isLoggedIn, onLogout, userEmail }) => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [activeFormats, setActiveFormats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    // Récupération des topics depuis le serveur
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/topics');
        const data = await response.json();
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMessages(sorted);
      } catch (err) {
        console.error("Erreur lors du chargement des topics :", err);
      }
    };

    fetchTopics();
  }, []);

  const toggleFormat = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (command === 'blockquote') {
      const isBlockquote = document.queryCommandValue('formatBlock') === 'blockquote';
      document.execCommand('formatBlock', false, isBlockquote ? 'div' : 'blockquote');
      setActiveFormats((prev) =>
        isBlockquote ? prev.filter((c) => c !== command) : [...prev, command]
      );
      return;
    }
    const isActive = document.queryCommandState(command);
    document.execCommand(command, false, null);
    setActiveFormats((prev) =>
      isActive ? prev.filter((c) => c !== command) : [...prev, command]
    );
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (title.trim() !== '' && message.trim() !== '') {
      const newPost = {
        user: userEmail || 'Anonyme',
        title,
        content: message,
        timestamp: new Date().toISOString(),
        comments: [],
        isFavorite: false,
      };

      try {
        const response = await fetch('http://localhost:3000/api/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });

        if (!response.ok) throw new Error('Erreur serveur');

        const savedPost = await response.json();
        setMessages([savedPost, ...messages]);
        setTitle('');
        setMessage('');
        setShowModal(false);
        setActiveFormats([]);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du topic :', error);
      }
    }
  };

  const handleAddComment = async (postId, newComment) => {
  if (newComment.trim() === '') return;

  try {
    const response = await fetch(`http://localhost:3000/api/topics/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: userEmail || 'Anonyme',
        content: newComment
      }),
    });

    if (!response.ok) throw new Error('Erreur serveur');

    const addedComment = await response.json();
    
    setMessages(prev =>
      prev.map(msg =>
        msg._id === postId
          ? { ...msg, comments: [...msg.comments, addedComment] }
          : msg
      )
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
  }
};

const handleDeleteComment = async (topicId, commentId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/topics/${topicId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) throw new Error('Erreur serveur');

    setMessages(prev =>
      prev.map(msg =>
        msg._id === topicId
          ? {
              ...msg,
              comments: msg.comments.filter(c => c.id !== commentId)
            }
          : msg
      )
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
  }
};
  

  const handleToggleFavorite = (postId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === postId ? { ...msg, isFavorite: !msg.isFavorite } : msg
      )
    );
  };

  const filteredMessages = messages.filter((msg) => {
    const inTitle = msg.title.toLowerCase().includes(searchTerm.toLowerCase());
    const byAuthor = msg.user.toLowerCase().includes(searchAuthor.toLowerCase());
    const inDateRange =
      (!startDate || new Date(msg.timestamp) >= new Date(startDate)) &&
      (!endDate || new Date(msg.timestamp) <= new Date(endDate));
    return inTitle && byAuthor && inDateRange;
  });

  return (
    <div>
      <header className="navbar">
        <Link to="/forum" className="logo">Blablaland</Link>
        <div className="nav-links">
          <div className="search-bar">
            <div className="search-bar-title">Recherche</div>
            <div className="search-row">
              <input type="text" placeholder="Titre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <input type="text" placeholder="Auteur..." value={searchAuthor} onChange={(e) => setSearchAuthor(e.target.value)} />
            </div>
            <div className="search-row">
              <div>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <div className="date-range-label">(inclus)</div>
              </div>
              <div>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <div className="date-range-label">(exclus)</div>
              </div>
            </div>
          </div>
          {!isLoggedIn ? (
            <>
              <Link to="/inscription">Inscription</Link>
              <Link to="/connexion">Connexion</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profil</Link>
              <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
            </>
          )}
        </div>
      </header>

      <main className="forum-main">
        <h3>Blabla partout, silence nulle part.</h3>
        {isLoggedIn && (
          <button className="create-post-btn" onClick={() => setShowModal(true)}>Créer un post</button>
        )}

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
                    <button type="button" className={activeFormats.includes('bold') ? 'active' : ''} onClick={() => toggleFormat('bold')}><b>B</b></button>
                    <button type="button" className={activeFormats.includes('italic') ? 'active' : ''} onClick={() => toggleFormat('italic')}><i>I</i></button>
                    <button type="button" className={activeFormats.includes('strikeThrough') ? 'active' : ''} onClick={() => toggleFormat('strikeThrough')}><s>S</s></button>
                    <button type="button" className={activeFormats.includes('blockquote') ? 'active' : ''} onClick={() => toggleFormat('blockquote')}>“”</button>
                    <button type="button" onClick={() => document.execCommand('insertUnorderedList')}>•</button>
                    <button type="button" onClick={() => document.execCommand('insertOrderedList')}>1.</button>
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
                  <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="messages">
          {filteredMessages.map((msg) => (
            <div key={msg._id} className="message-thread">
              <button
                className={`favorite-btn ${msg.isFavorite ? 'favorited' : ''}`}
                onClick={() => handleToggleFavorite(msg._id)}
                aria-label={msg.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {msg.isFavorite ? '★' : '☆'}
              </button>
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
                  />
                ))}
                {isLoggedIn && <CommentForm onSubmit={(newComment) => handleAddComment(msg._id, newComment)} />}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ForumPage;
