import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import UsersValidation from './AdminUsersValidation';
import AllUsersManagement from './AllUsersManagement';
import ProfileSidebar from './ProfileSidebar';
import ProfileSections from './ProfileSections';

function Profile({ isLoggedIn, messages, setMessages }) {
  const { email } = useParams();
  const navigate = useNavigate();

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
      <ProfileSidebar 
        navigate={navigate}
        userInfo={userInfo}
        setActiveSection={setActiveSection}
      />
      
      <ProfileSections
        isPublicProfile={isPublicProfile}
        profileUser={profileUser}
        activeSection={activeSection}
        postedTopics={postedTopics}
        favoriteTopics={favoriteTopics}
        userInfo={userInfo}
        messages={messages}
        setMessages={setMessages}
        fetchFavoriteTopics={fetchFavoriteTopics}
      />
    </div>
  );
}

export default Profile;