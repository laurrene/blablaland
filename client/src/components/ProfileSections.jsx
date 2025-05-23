import { useRef, useEffect } from 'react';
import ProfileInfoSection from './ProfileInfoSection';
import ProfileTopicsSection from './ProfileTopicsSection';
import ProfileFavoritesSection from './ProfileFavoritesSection';
import UsersValidation from './AdminUsersValidation';
import AllUsersManagement from './AllUsersManagement';

export default function ProfileSections({
  isPublicProfile,
  profileUser,
  activeSection,
  postedTopics,
  favoriteTopics,
  userInfo,
  messages,
  setMessages,
  fetchFavoriteTopics
}) {
  const informationsRef = useRef(null);
  const topicsPostesRef = useRef(null);
  const topicsFavorisRef = useRef(null);
  const pendingUsersRef = useRef(null);
  const usersManagementRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const refs = {
      informations: informationsRef,
      topicsPostes: topicsPostesRef,
      topicsFavoris: topicsFavorisRef,
      pendingUsers: pendingUsersRef,
      usersManagement: usersManagementRef
    };
    
    if (refs[activeSection]) {
      setTimeout(() => scrollToSection(refs[activeSection]), 100);
    }
  }, [activeSection]);

  return (
    <div className="main-content">
      <h1>{isPublicProfile ? `Profil de ${profileUser.prenom} ${profileUser.nom}` : 'Bienvenue sur votre page de profil'}</h1>

      <ProfileInfoSection 
        activeSection={activeSection}
        informationsRef={informationsRef}
        profileUser={profileUser}
      />

      <ProfileTopicsSection 
        activeSection={activeSection}
        topicsPostesRef={topicsPostesRef}
        postedTopics={postedTopics}
        messages={messages}
        setMessages={setMessages}
      />

      <ProfileFavoritesSection 
        activeSection={activeSection}
        topicsFavorisRef={topicsFavorisRef}
        favoriteTopics={favoriteTopics}
        isPublicProfile={isPublicProfile}
        profileUser={profileUser}
        fetchFavoriteTopics={fetchFavoriteTopics}
      />

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
  );
}