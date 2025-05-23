import React, { useState, useEffect } from 'react';
import '../styles/ForumPage.css';
import NavigationBar from './NavigationBar';
import PostModal from './PostModal';
import MessageThread from './MessageThread';

const ForumPage = ({ isLoggedIn, onLogout, userEmail }) => {

  //Différents states du composant
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [activeFormats, setActiveFormats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  //Fonction pour vérifier si l'utilisateur est un admin ou non
  const checkIsAdmin = async (email) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${email}`);
      if (!res.ok) return false;
      const user = await res.json();
      return user.statut === 'admin';
    } catch (err) {
      console.error("Erreur lors de la vérification du statut admin:", err);
      return false;
    }
  };
  //S'il est admin, alors on lui donne les permissions d'admins
  useEffect(() => {
    if (userEmail) {
      checkIsAdmin(userEmail).then(admin => setIsAdmin(admin));
    }

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
  }, [userEmail]);

  //Différentes fonctions qui gèrent les différentes fonctionnalités :

  //Création d'un nouveau post
  const handlePost = async (e) => {
    e.preventDefault();
    if (title.trim() !== '' && message.trim() !== '') {
      const newPost = {
        user: userEmail,
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

  //Ajout d'un commentaire
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

  //Suppression d’un commentaire

  const handleDeleteComment = async (topicId, commentId) => {
    try {
      let endpoint = `http://localhost:3000/api/topics/${topicId}/comments/${commentId}`;
      let method = 'DELETE';
      let body = { userEmail };

      if (isAdmin) {
        endpoint = `http://localhost:3000/api/admin/topics/${topicId}/comments/${commentId}`;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      alert(error.message);
    }
  };

//Suppression d’un topic
  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce topic ?")) return;
    
    try {
      let endpoint = `http://localhost:3000/api/topics/${topicId}`;
      let method = 'DELETE';
      let body = { userEmail };

      if (isAdmin) {
        endpoint = `http://localhost:3000/api/admin/topics/${topicId}`;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Erreur serveur');

      setMessages(prev => prev.filter(msg => msg._id !== topicId));
    } catch (error) {
      console.error("Erreur lors de la suppression du topic :", error);
      alert(error.message);
    }
  };

//Ajout et suppression d’un favori
  const handleToggleFavorite = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/topics/${postId}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });

      if (!response.ok) throw new Error('Erreur serveur');

      const { isFavorite } = await response.json();
      
      setMessages(prev =>
        prev.map(msg =>
          msg._id === postId ? { ...msg, isFavorite } : msg
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris :", error);
    }
  };

  //Filtre les topics par auteur/titre/intervalle de temps
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
      <NavigationBar 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        searchAuthor={searchAuthor}
        setSearchAuthor={setSearchAuthor}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <main className="forum-main">
        <h3>Blabla partout, silence nulle part.</h3>
        {isLoggedIn && (
          <button className="create-post-btn" onClick={() => setShowModal(true)}>Créer un post</button>
        )}

        <PostModal 
          showModal={showModal}
          setShowModal={setShowModal}
          title={title}
          setTitle={setTitle}
          message={message}
          setMessage={setMessage}
          handlePost={handlePost}
          activeFormats={activeFormats}
          setActiveFormats={setActiveFormats}
        />

        <div className="messages">
          {filteredMessages.map((msg) => (
            <MessageThread 
              key={msg._id}
              msg={msg}
              isLoggedIn={isLoggedIn}
              userEmail={userEmail}
              isAdmin={isAdmin}
              handleToggleFavorite={handleToggleFavorite}
              handleDeleteTopic={handleDeleteTopic}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ForumPage;