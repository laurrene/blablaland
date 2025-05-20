import  { useState } from "react";
import "../styles/Login.css";
import { Link } from 'react-router-dom';

export default function ConnexionForm() {
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!identifiant || !password) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        setErreur("");
        alert("Connexion réussie !");
    };

    const handleReset = () => {
        setIdentifiant("");
        setPassword("");
        setErreur("");
    };

    return (
        <div className="container">
            <Link to="/forum">
                <h1 style={{ color: "#b92b27", cursor: "pointer" }}>Blablaland</h1>
            </Link>
            <p>Blabla partout, silence nulle part.</p>

            <div className="login-box">
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="identifiant">Identifiant</label>
                        <input 
                            id="identifiant" 
                            type="text"
                            value={identifiant} 
                            onChange={(e) => setIdentifiant(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-btn">Se connecter</button>
                    <button type="button" className="reset-btn" onClick={handleReset}>Annuler</button>
                </form>
                <Link to="/inscription">Pas de compte ? S'inscrire</Link>

            </div>

            <p className="footer">© BlaBlaLand, Inc. 2025</p>
        </div>
    );
}