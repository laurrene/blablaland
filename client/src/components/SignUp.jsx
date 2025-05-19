import React, { useState } from "react";
import "../styles/SignUp.css";

export default function InscriptionForm() {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [erreur, setErreur] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== password2) {
            setErreur("Les mots de passe ne correspondent pas !");
            return;
        }

        setErreur("");
        alert("Inscription réussie !");
        console.log("Formulaire :", { prenom, nom, identifiant, password });
    };

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
            <h1 style={{ color: "#b92b27" }}>BlaBlaLand</h1>
            <p>Votre voix compte – discutez, partagez, connectez !</p>

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
                        <label htmlFor="identifiant">Identifiant</label>
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

                    <button type="submit" className="submit-btn">Enregistrement</button>
                    <button type="button" className="reset-btn" onClick={handleReset}>Annuler</button>

                </form>
                <p><a href="connexion.html">Déjà un compte ? Se connecter</a></p>
            </div>

            <p className="footer">©BlaBlaLand, Inc. 2025</p>
        </div>
    );
}


