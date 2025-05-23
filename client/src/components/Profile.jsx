import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Profile.css';
import UsersValidation from './AdminUsersValidation';
import AllUsersManagement from './AllUsersManagement';

function Profile({ isLoggedIn, messages, setMessages }) {
  const { email } = useParams();
  const [activeSection, setActiveSection] = useState('informations');
  const [postedTopics, setPostedTopics] = useState([]);
  const [favoriteTopics, setFavoriteTopics] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // Filtrer topics ici une fois les données utilisateur chargées
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

      // Mettre à jour la liste des favoris
      fetchFavoriteTopics();
      
      // Mettre à jour l'état dans ForumPage si nécessaire
      setMessages(prev =>
        prev.map(msg =>
          msg._id === topicId ? { ...msg, isFavorite: false } : msg
        )
      );
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris :", error);
    }
  };

  // Fonction pour récupérer les favoris
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

  // Ajoutez cet useEffect pour charger les favoris
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
        <h2>Mon Espace</h2>
        <button onClick={() => setActiveSection('informations')}>Informations personnelles</button>
        <button onClick={() => setActiveSection('profil')}>Page de profil (publique)</button>
        <button onClick={() => setActiveSection('topicsPostes')}>Topics postés</button>
        <button onClick={() => setActiveSection('topicsFavoris')}>Topics favoris</button>
        {userInfo.statut === 'admin' && (
          <button onClick={() => setActiveSection('pendingUsers')}>Utilisateurs en attente</button>
        )}
        {userInfo.statut === 'admin' && (
          <button onClick={() => setActiveSection('pendingUsers')}>Gestion des utilisateurs</button>
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

        <div className={`content-section ${activeSection === 'topicsFavoris' ? 'active' : ''}`}>
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

        <div className={`content-section ${activeSection === 'pendingUsers' ? 'active' : ''}`}>
          {userInfo.statut === 'admin' ? <UsersValidation /> : <p>Vous n'avez pas accès à cette section.</p>}
        </div>

        <div className={`content-section ${activeSection === 'pendingUsers' ? 'active' : ''}`}>
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