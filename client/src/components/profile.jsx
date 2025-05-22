// client/components/profile.jsx
import { useState, useEffect } from 'react';
import '../styles/Profile.css';

function Profile({ isLoggedIn, messages, setMessages }) {
  const [activeSection, setActiveSection] = useState('informations');
  const [postedTopics, setPostedTopics] = useState([]);

  useEffect(() => {
    // Filtrer les topics postés par l'utilisateur actuel
    const userTopics = messages.filter(topic => topic.user === 'Moi');
    setPostedTopics(userTopics);
  }, [messages]);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      // Suppression dans la base de données
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      // Mise à jour de l'état local
      const updatedMessages = messages.filter(topic => topic._id !== topicId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Erreur lors de la suppression du topic:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="sidebar">
        <h2>Mon Espace</h2>
        <button onClick={() => showSection('informations')}>Informations personnelles</button>
        <button onClick={() => showSection('profil')}>Page de profil (publique)</button>
        <button onClick={() => showSection('topicsPostes')}>Topics postés</button>
        <button onClick={() => showSection('topicsFavoris')}>Topics favoris</button>
        <button onClick={() => showSection('messages')}>Messages envoyés</button>
      </div>

      <div className="main-content">
        <h1>Bienvenue sur la page de profil</h1>

        <div className={`content-section ${activeSection === 'informations' ? 'active' : ''}`}>
          <h2>Informations personnelles</h2>
          <p>Nom d'utilisateur : LaurreneLI</p>
          <p>Email : laurrene@example.com</p>
          <p>Membre depuis : Janvier 2025</p>
        </div>

        <div className={`content-section ${activeSection === 'profil' ? 'active' : ''}`}>
          <h2>Page de profil (publique)</h2>
          <p>Bio publique, nombre de publications, avatar, etc.</p>
        </div>

        <div className={`content-section ${activeSection === 'topicsPostes' ? 'active' : ''}`}>
          <h2>Topics postés</h2>
          <div className="topics-list">
            {postedTopics.length > 0 ? (
              postedTopics.map(topic => (
                <div key={topic._id} className="topic-item">
                  <h3>{topic.title}</h3>
                  <button 
                    className="delete-topic-btn"
                    onClick={() => handleDeleteTopic(topic._id)}
                  >
                    Supprimer
                  </button>
                </div>
              ))
            ) : (
              <p>Aucun topic posté pour le moment.</p>
            )}
          </div>
        </div>

        <div className={`content-section ${activeSection === 'topicsFavoris' ? 'active' : ''}`}>
          <h2>Topics favoris</h2>
          <p>Liste des sujets que vous avez mis en favoris.</p>
        </div>

        <div className={`content-section ${activeSection === 'messages' ? 'active' : ''}`}>
          <h2>Messages envoyés</h2>
          <p>Historique de vos messages privés envoyés.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;