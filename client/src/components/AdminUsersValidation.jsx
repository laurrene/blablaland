import React, { useEffect, useState } from 'react';

export default function AdminUsersValidation() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer la liste des utilisateurs en attente
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/users/en-attente');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setPendingUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Valider un utilisateur
  const validateUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/valider/${userId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Erreur lors de la validation');
      // Retirer l’utilisateur validé de la liste
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      alert('Utilisateur validé avec succès !');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Utilisateurs en attente de validation</h2>
      {pendingUsers.length === 0 ? (
        <p>Aucun utilisateur en attente.</p>
      ) : (
        <ul>
          {pendingUsers.map(user => (
            <li key={user._id} style={{ marginBottom: '10px' }}>
              {user.prenom} {user.nom} - {user.email}{' '}
              <button onClick={() => validateUser(user._id)}>Valider</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
