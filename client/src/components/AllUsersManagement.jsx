import { useEffect, useState } from 'react';
import AdminUserManagement from './AdminUserManagement'; // Boutons promotion/rétrogradation

export default function AllUsersManagement({ currentAdmin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/users');
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Erreur de chargement des utilisateurs :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Chargement des utilisateurs...</div>;

  return (
    <div>
      <h2>Gestion de tous les utilisateurs</h2>
      {users.length === 0 && <p>Aucun utilisateur trouvé.</p>}
      {users.map((user) =>
        user.email !== currentAdmin.email ? (
          <div
            key={user._id}
            style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}
          >
            <p>
              {user.prenom} {user.nom} ({user.email}) — <strong>{user.statut}</strong>
            </p>
            <AdminUserManagement user={user} onUserUpdated={fetchUsers} />
          </div>
        ) : null
      )}
    </div>
  );
}
