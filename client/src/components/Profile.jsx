import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import UsersValidation from './AdminUsersValidation';
import AllUsersManagement from './AllUsersManagement';
import ProfileSidebar from './ProfileSidebar';
import ProfileSections from './ProfileSections';

function Profile({ isLoggedIn, messages, setMessages }) {
  const { email } = useParams(); // Récupération email en URL
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('informations'); // Section active
  const [postedTopics, setPostedTopics] = useState([]); // Topics postés utilisateur
  const [favoriteTopics, setFavoriteTopics] = useState([]); // Topics favoris utilisateur
  const [profileUser, setProfileUser] = useState(null); // Données du profil affiché
  const [loading, setLoading] = useState(true); // État chargement

  const isPublicProfile = !!email; // Profil public si email présent en paramètre
  // Infos utilisateur courant récupérées localStorage
  const userInfo = {
    prenom: localStorage.getItem('firstName') || 'Prénom inconnu',
    nom: localStorage.getItem('lastName') || 'Nom inconnu',
    email: localStorage.getItem('userEmail') || 'Email inconnu',
    statut: (localStorage.getItem('userStatut') || 'membre').toLowerCase()
  };

  // Récupération des données du profil à afficher
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userData;

        if (isPublicProfile) {
          // Si profil public, fetch données user par email
          const response = await fetch(`http://localhost:3000/api/users/${email}`);
          if (!response.ok) throw new Error('Utilisateur non trouvé');
          userData = await response.json();
        } else {
          // Sinon profil connecté = infos locales
          userData = { ...userInfo };
        }

        setProfileUser(userData);

        // Filtrer messages postés par cet utilisateur
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

  // Fonction pour charger les favoris de l'utilisateur
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

  // Chargement des favoris dès que profileUser est défini
  useEffect(() => {
    if (profileUser) {
      fetchFavoriteTopics();
    }
  }, [profileUser]);

  // Affichage loading ou erreur si besoin
  if (loading) return <div>Chargement...</div>;
  if (!profileUser) return <div>Utilisateur non trouvé</div>;

  return (
    // Conteneur principal avec sidebar et sections
    <div style={{ display: 'flex' }}>
      <ProfileSidebar 
        navigate={navigate} // navigation pour forum
        userInfo={userInfo} // infos utilisateur connecté
        setActiveSection={setActiveSection} // changer section active
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
        fetchFavoriteTopics={fetchFavoriteTopics} // rafraîchir favoris
      />
    </div>
  );
}

export default Profile;
