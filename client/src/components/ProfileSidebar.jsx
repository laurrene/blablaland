import { useNavigate } from 'react-router-dom';

export default function ProfileSidebar({ navigate, userInfo, setActiveSection }) {
  return (
    <div className="sidebar">
      {/* Titre cliquable qui redirige vers le forum */}
      <h2
        onClick={() => navigate('/forum')}
        style={{ cursor: 'pointer', color: '#4f46e5' }}
        title="Aller au forum"
      >
        Blablaland
      </h2>

      {/* Boutons pour changer la section active */}
      <button onClick={() => setActiveSection('informations')}>Informations personnelles</button>
      <button onClick={() => setActiveSection('topicsPostes')}>Topics postés</button>
      <button onClick={() => setActiveSection('topicsFavoris')}>Topics favoris</button>
      
      {/* Options supplémentaires pour les admins */}
      {userInfo.statut === 'admin' && (
        <button onClick={() => setActiveSection('pendingUsers')}>Utilisateurs en attente</button>
      )}
      {userInfo.statut === 'admin' && (
        <button onClick={() => setActiveSection('usersManagement')}>Gestion des utilisateurs</button>
      )}
    </div>
  );
}
