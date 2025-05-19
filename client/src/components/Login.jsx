import React, { useState } from "react";
import "../styles/Login.css";

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
            <h1>BlaBlaLand</h1>
            <p>Votre voix compte – discutez, partagez, connectez !</p>

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
                <p style={{ marginTop: "15px" }}>
                    <a href="#inscription">Pas de compte ? S'inscrire</a>
                </p>
            </div>

            <p className="footer">© BlaBlaLand, Inc. 2025</p>
        </div>
    );
}