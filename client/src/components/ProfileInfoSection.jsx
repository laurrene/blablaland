export default function ProfileInfoSection({ activeSection, informationsRef, profileUser }) {
  return (
    // Section d'infos perso, affichée si activeSection est 'informations'
    <div 
      className={`content-section ${activeSection === 'informations' ? 'active' : ''}`}
      ref={informationsRef} // Réf pour le scroll
    >
      <h2>Informations personnelles</h2>
      <div className="info-grid">
        {/* Affichage des données utilisateur */}
        <p><strong>Prénom:</strong> {profileUser.prenom}</p>
        <p><strong>Nom:</strong> {profileUser.nom}</p>
        <p><strong>Email:</strong> {profileUser.email}</p>
        <p><strong>Statut:</strong> {profileUser.statut}</p>
      </div>
    </div>
  );
}
