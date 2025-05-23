import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Profile.css';
import UsersValidation from './AdminUsersValidation'; // Assure-toi que le chemin est correct

function Profile({ isLoggedIn, messages, setMessages }) {
  const { email } = useParams();
  const [activeSection, setActiveSection] = useState('informations');
  const [postedTopics, setPostedTopics] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Si email est présent dans les params, c'est une vue publique
  const isPublicProfile = !!email;
  const userInfo = {
    prenom: localStorage.getItem('firstName') || 'Prénom inconnu',
    nom: localStorage.getItem('lastName') || 'Nom inconnu',
    email: localStorage.getItem('userEmail') || 'Email inconnu',
    statut: localStorage.getItem('userStatut') // ex: 'admin' ou 'membre'
  };

  useEffect(() => {
    const userTopics = messages.filter(topic => topic.user === userInfo.email);
    setPostedTopics(userTopics);
  }, [messages, userInfo.email]);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userData;
        
        if (isPublicProfile) {
          // Récupérer les infos de l'utilisateur cible
          const response = await fetch(`http://localhost:3000/api/users/${email}`);
          if (!response.ok) throw new Error('Utilisateur non trouvé');
          userData = await response.json();
        } else {
          // Infos de l'utilisateur connecté
          userData = {
            prenom: localStorage.getItem('firstName') || 'Prénom inconnu',
            nom: localStorage.getItem('lastName') || 'Nom inconnu',
            email: localStorage.getItem('userEmail') || 'Email inconnu',
            statut: localStorage.getItem('userStatut') || 'Membre'
          };
        }
        
        setProfileUser(userData);
        
        // Filtrer les topics de l'utilisateur
        const userTopics = messages.filter(topic => topic.user === userData.email);
        setPostedTopics(userTopics);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, messages, isPublicProfile]);

  const handleDeleteTopic = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      const updatedMessages = messages.filter(topic => topic._id !== topicId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Erreur lors de la suppression du topic :', error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!profileUser) return <div>Utilisateur non trouvé</div>;

  return (
    <div style={{ display: 'flex' }}>
      <div className="sidebar">
        <h2>Mon Espace</h2>
        <button onClick={() => showSection('informations')}>Informations personnelles</button>
        <button onClick={() => showSection('profil')}>Page de profil (publique)</button>
        <button onClick={() => showSection('topicsPostes')}>Topics postés</button>
        <button onClick={() => showSection('topicsFavoris')}>Topics favoris</button>
        <button onClick={() => showSection('messages')}>Messages envoyés</button>

        {userInfo.statut === 'admin' && (
          <button onClick={() => showSection('pendingUsers')}>Utilisateurs en attente</button>
        )}
      </div>

      <div className="main-content">
        <h1>{isPublicProfile ? `Profil de ${profileUser.prenom} ${profileUser.nom}` : 'Bienvenue sur votre page de profil'}</h1>

        <div className={`content-section ${activeSection === 'informations' ? 'active' : ''}`}>
          <h2>Informations personnelles</h2>
            <p>Prénom : {profileUser.prenom}</p>
            <p>Nom : {profileUser.nom}</p>
            <p>Email : {profileUser.email}</p>
            <p>Statut : {profileUser.statut}</p>
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
                  <h3>
                    <a href={`/forum#topic-${topic._id}`} className="topic-link">
                      {topic.title}
                    </a>
                  </h3>
                  <div className="topic-meta">
                    Posté le : {new Date(topic.timestamp).toLocaleDateString()}
                  </div>
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

        {/* Nouvel onglet admin */}
        <div className={`content-section ${activeSection === 'pendingUsers' ? 'active' : ''}`}>
          <h2>Utilisateurs en attente</h2>
          {userInfo.statut === 'admin' ? (
            <UsersValidation />
          ) : (
            <p>Vous n'avez pas accès à cette section.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
