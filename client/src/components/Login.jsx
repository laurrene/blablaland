import { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from 'react-router-dom';

export default function ConnexionForm({ setIsLoggedIn, setUserEmail }) {
    // États pour identifiant, mot de passe et message d'erreur
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();

    // Fonction appelée à la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        // Validation simple des champs
        if (!identifiant || !password) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        setErreur("");
        try {
            // Requête POST pour se connecter
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: identifiant, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErreur(data.error || "Erreur lors de la connexion");
            } else {
                alert("Connexion réussie !");
                // Sauvegarde des infos utilisateur en localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('firstName', data.user.prenom);
                localStorage.setItem('lastName', data.user.nom);
                localStorage.setItem('userStatut', data.user.statut);
                setIsLoggedIn(true);
                setUserEmail(data.user.email);
                navigate("/forum"); // redirection après connexion
            }
        } catch (err) {
            setErreur("Erreur réseau");
        }
    };

    // Réinitialise les champs et l'erreur
    const handleReset = () => {
        setIdentifiant("");
        setPassword("");
        setErreur("");
    };

    // JSX rendu : formulaire de connexion avec gestion des erreurs
    return (
        <div className="container">
            {/* Titre cliquable pour revenir au forum */}
            <Link to="/forum">
                <h1 style={{ color: "#b92b27", cursor: "pointer" }}>Blablaland</h1>
            </Link>
            <p>Blabla partout, silence nulle part.</p>

            <div className="login-box">
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    {/* Champ identifiant */}
                    <div className="form-group">
                        <label htmlFor="identifiant">Identifiant</label>
                        <input 
                            id="identifiant" 
                            type="text"
                            value={identifiant} 
                            onChange={(e) => setIdentifiant(e.target.value)}
                        />
                    </div>
                    {/* Champ mot de passe */}
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Affiche message d'erreur si présent */}
                    {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                    {/* Boutons soumettre et annuler */}
                    <button type="submit" className="submit-btn">Se connecter</button>
                    <button type="button" className="reset-btn" onClick={handleReset}>Annuler</button>
                </form>
                {/* Lien vers la page d'inscription */}
                <Link to="/inscription">Pas de compte ? S'inscrire</Link>
            </div>

            {/* Pied de page */}
            <p className="footer">© Blablaland, Inc. 2025</p>
        </div>
    );
}
