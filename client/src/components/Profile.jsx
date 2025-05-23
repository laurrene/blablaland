import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import UsersValidation from './AdminUsersValidation';
import AllUsersManagement from './AllUsersManagement';

function Profile({ isLoggedIn, messages, setMessages }) {
  const { email } = useParams();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('informations');
  const [postedTopics, setPostedTopics] = useState([]);
  const [favoriteTopics, setFavoriteTopics] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const informationsRef = useRef(null);
  const topicsPostesRef = useRef(null);
  const topicsFavorisRef = useRef(null);
  const pendingUsersRef = useRef(null);
  const usersManagementRef = useRef(null);

  const isPublicProfile = !!email;
  const userInfo = {
    prenom: localStorage.getItem('firstName') || 'Prénom inconnu',
    nom: localStorage.getItem('lastName') || 'Nom inconnu',
    email: localStorage.getItem('userEmail') || 'Email inconnu',
    statut: (localStorage.getItem('userStatut') || 'membre').toLowerCase()
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userData;

        if (isPublicProfile) {
          const response = await fetch(`http://localhost:3000/api/users/${email}`);
          if (!response.ok) throw new Error('Utilisateur non trouvé');
          userData = await response.json();
        } else {
          userData = { ...userInfo };
        }

        setProfileUser(userData);

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

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSectionClick = (section, ref) => {
    setActiveSection(section);
    if (ref) {
      setTimeout(() => scrollToSection(ref), 100);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      const updatedMessages = messages.filter(topic => topic._id !== topicId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Erreur lors de la suppression du topic :', error);
    }
  };

  const handleRemoveFavorite = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: profileUser.email }),
      });

      if (!response.ok) throw new Error('Erreur serveur');

      fetchFavoriteTopics();
      
      setMessages(prev =>
        prev.map(msg =>
          msg._id === topicId ? { ...msg, isFavorite: false } : msg
        )
      );
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris :", error);
    }
  };

  const fetchFavoriteTopics = async () => {
    try {
      const userEmailToFetch = isPublicProfile ? email : profileUser?.email;
      if (!userEmailToFetch) return;

      const response = await fetch(`http://localhost:3000/api/users/${userEmailToFetch}/favorites`);
      if (!response.ok) throw new Error('Erreur serveur');
      const favorites = await response.json();
      setFavoriteTopics(favorites);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris :", error);
    }
  };

  useEffect(() => {
    if (profileUser) {
      fetchFavoriteTopics();
    }
  }, [profileUser]);

  if (loading) return <div>Chargement...</div>;
  if (!profileUser) return <div>Utilisateur non trouvé</div>;

  return (
    <div style={{ display: 'flex' }}>
      <div className="sidebar">
        <h2
          onClick={() => navigate('/forum')}
          style={{ cursor: 'pointer', color: '#4f46e5' }}
          title="Aller au forum"
        >
          Blablaland
        </h2>

        <button onClick={() => handleSectionClick('informations', informationsRef)}>Informations personnelles</button>
        <button onClick={() => handleSectionClick('topicsPostes', topicsPostesRef)}>Topics postés</button>
        <button onClick={() => handleSectionClick('topicsFavoris', topicsFavorisRef)}>Topics favoris</button>
        
        {userInfo.statut === 'admin' && (
          <button onClick={() => handleSectionClick('pendingUsers', pendingUsersRef)}>Utilisateurs en attente</button>
        )}
        {userInfo.statut === 'admin' && (
          <button onClick={() => handleSectionClick('usersManagement', usersManagementRef)}>Gestion des utilisateurs</button>
        )}
      </div>

      <div className="main-content">
        <h1>{isPublicProfile ? `Profil de ${profileUser.prenom} ${profileUser.nom}` : 'Bienvenue sur votre page de profil'}</h1>

        <div 
          className={`content-section ${activeSection === 'informations' ? 'active' : ''}`}
          ref={informationsRef}
        >
          <h2>Informations personnelles</h2>
          <div className="info-grid">
            <p><strong>Prénom:</strong> {profileUser.prenom}</p>
            <p><strong>Nom:</strong> {profileUser.nom}</p>
            <p><strong>Email:</strong> {profileUser.email}</p>
            <p><strong>Statut:</strong> {profileUser.statut}</p>
          </div>
        </div>

        <div 
          className={`content-section ${activeSection === 'topicsPostes' ? 'active' : ''}`}
          ref={topicsPostesRef}
        >
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
                  <div className="topic-meta">Posté le : {new Date(topic.timestamp).toLocaleDateString()}</div>
                  <button className="delete-topic-btn" onClick={() => handleDeleteTopic(topic._id)}>
                    Supprimer
                  </button>
                </div>
              ))
            ) : (
              <p>Aucun topic posté pour le moment.</p>
            )}
          </div>
        </div>

        <div 
          className={`content-section ${activeSection === 'topicsFavoris' ? 'active' : ''}`}
          ref={topicsFavorisRef}
        >
          <h2>Topics favoris</h2>
          <div className="favorites-list">
            {favoriteTopics.length > 0 ? (
              favoriteTopics.map(topic => (
                <div key={topic._id} className="favorite-item">
                  <h3>
                    <a href={`/forum#topic-${topic._id}`} className="topic-link">
                      {topic.title}
                    </a>
                  </h3>
                  {!isPublicProfile && (
                    <button 
                      className="remove-favorite-btn"
                      onClick={() => handleRemoveFavorite(topic._id)}
                    >
                      Supprimer des favoris
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>Aucun topic favori pour le moment.</p>
            )}
          </div>
        </div>

        <div 
          className={`content-section ${activeSection === 'pendingUsers' ? 'active' : ''}`}
          ref={pendingUsersRef}
        >
          {userInfo.statut === 'admin' ? <UsersValidation /> : <p>Vous n'avez pas accès à cette section.</p>}
        </div>

        <div 
          className={`content-section ${activeSection === 'usersManagement' ? 'active' : ''}`}
          ref={usersManagementRef}
        >
          {userInfo.statut === 'admin' ? (
            <AllUsersManagement currentAdmin={userInfo} />
          ) : (
            <p>Vous n'avez pas accès à cette section.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;