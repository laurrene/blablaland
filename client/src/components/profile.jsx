import { useState } from 'react';
import '../styles/Profile.css';
import TopicForm from './TopicForm';

function Profile({ messages, setMessages }) {
  const [activeSection, setActiveSection] = useState('informations');
  const [postedTopics, setPostedTopics] = useState([]);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleDeleteTopic = (topicId) => {
    // Supprimer le topic de la liste des messages
    const updatedMessages = messages.filter(topic => topic.id !== topicId);
    setMessages(updatedMessages);

    // Supprimer le topic de la liste des topics postés (si utilisé)
    const updatedPostedTopics = postedTopics.filter(topic => topic.id !== topicId);
    setPostedTopics(updatedPostedTopics);

    // Mettre à jour le localStorage
    localStorage.setItem('forumMessages', JSON.stringify(updatedMessages));
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
            {messages
              .filter(topic => topic.user === 'Moi')
              .map(topic => (
                <div key={topic.id} className="topic">
                  <h3>{topic.title}</h3>
                  <div className="meta">
                    {topic.user} – {new Date(topic.timestamp).toLocaleString()}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: topic.content }} />
                  <button onClick={() => handleDeleteTopic(topic.id)}>🗑 Supprimer</button>
                </div>
              ))}
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