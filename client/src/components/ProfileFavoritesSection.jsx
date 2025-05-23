export default function ProfileFavoritesSection({
  activeSection,
  topicsFavorisRef,
  favoriteTopics,
  isPublicProfile,
  profileUser,
  fetchFavoriteTopics
}) {
  // Fonction pour retirer un topic des favoris
  const handleRemoveFavorite = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: profileUser.email }),
      });

      if (!response.ok) throw new Error('Erreur serveur');
      fetchFavoriteTopics(); // Actualiser la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris :", error);
    }
  };

  return (
    // Section affichée si activeSection vaut 'topicsFavoris'
    <div 
      className={`content-section ${activeSection === 'topicsFavoris' ? 'active' : ''}`}
      ref={topicsFavorisRef} // Réf pour scroll
    >
      <h2>Topics favoris</h2>
      <div className="favorites-list">
        {/* Liste des topics favoris */}
        {favoriteTopics.length > 0 ? (
          favoriteTopics.map(topic => (
            <div key={topic._id} className="favorite-item">
              <h3>
                <a href={`/forum#topic-${topic._id}`} className="topic-link">
                  {topic.title}
                </a>
              </h3>
              {/* Bouton pour retirer des favoris si profil privé */}
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
          <p>Aucun topic favori pour le moment.</p> // Message si aucun favori
        )}
      </div>
    </div>
  );
}
