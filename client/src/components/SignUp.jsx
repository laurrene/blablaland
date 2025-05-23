import { useState } from "react";
import "../styles/SignUp.css";
import { Link, useNavigate } from 'react-router-dom';

export default function InscriptionForm() {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prenom || !nom || !identifiant || !password || !password2) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        if (password !== password2) {
            setErreur("Les mots de passe ne correspondent pas !");
            return;
        }

        setErreur("");
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prenom, nom, email: identifiant, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErreur(data.error || "Erreur lors de l'inscription");
            } else {
                alert("Inscription réussie !");
                navigate("/connexion");
            }
        } catch (err) {
            setErreur("Erreur réseau");
        }
    };

    // Réinitialise tous les champs du formulaire
    const handleReset = () => {
        setPrenom("");
        setNom("");
        setIdentifiant("");
        setPassword("");
        setPassword2("");
        setErreur("");
    };

    return (
        <div className="container">
            {/* Titre avec lien vers forum */}
            <Link to="/forum">
                <h1 style={{ color: "#b92b27", cursor: "pointer" }}>Blablaland</h1>
            </Link>

            <p>Blabla partout, silence nulle part.</p>

            {/* Formulaire d'inscription */}
            <div className="login-box">
                <p>Enregistrement</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="prenom">Prénom</label>
                        <input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nom">Nom</label>
                        <input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="identifiant">Identifiant (email)</label>
                        <input id="identifiant" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2">Retapez</label>
                        <input type="password" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    </div>

                    {/* Affiche l'erreur si présente */}
                    {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

                    <button type="submit" className="submit-btn">Enregistrement</button>
                    <button type="button" className="reset-btn" onClick={handleReset}>Annuler</button>
                </form>

                {/* Lien vers page de connexion */}
                <Link to="/connexion">Déjà un compte ? Se connecter</Link>
            </div>

            <p className="footer">©BlaBlaLand, Inc. 2025</p>
        </div>
    );
}
