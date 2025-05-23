export default function AdminUserManagement({ user, onUserUpdated }) {

    // Fonction pour promouvoir un utilisateur au rang d'admin
  const handlePromotion = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/promouvoir/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: localStorage.getItem('userEmail') })
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok && onUserUpdated) onUserUpdated();
    } catch (err) {
      alert('Erreur lors de la promotion');
      console.error(err);
    }
  };

  // Fonction pour rétrograder un admin au rang de membre
  const handleRetrogradation = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/retrograder/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: localStorage.getItem('userEmail') })
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok && onUserUpdated) onUserUpdated();
    } catch (err) {
      alert('Erreur lors de la rétrogradation');
      console.error(err);
    }
  };

  //Differents boutons pour differents fonctionnalités
  return (
    <div>
      <h3>Gérer les droits de l'utilisateur</h3>
      {user.statut === 'admin' ? (
        <button onClick={handleRetrogradation}>Rétrograder en membre</button>
      ) : (
        <button onClick={handlePromotion}>Promouvoir en admin</button>
      )}
    </div>
  );
}
