import { useState } from "react";
import "../styles/SignUp.css";
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9

export default function InscriptionForm() {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [erreur, setErreur] = useState("");
<<<<<<< HEAD

    const handleSubmit = (e) => {
        e.preventDefault();

=======
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prenom || !nom || !identifiant || !password || !password2) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
        if (password !== password2) {
            setErreur("Les mots de passe ne correspondent pas !");
            return;
        }

        setErreur("");
<<<<<<< HEAD
        alert("Inscription réussie !");
        console.log("Formulaire :", { prenom, nom, identifiant, password });
=======
        try {
            const res = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prenom, nom, email: identifiant, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErreur(data.error || "Erreur lors de l'inscription");
            } else {
                alert("Inscription réussie !");
                navigate("/connexion");  // redirige vers connexion après inscription
            }
        } catch (err) {
            setErreur("Erreur réseau");
        }
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
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
<<<<<<< HEAD
            <Link to="/">
=======
            <Link to="/forum">
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
                <h1 style={{ color: "#b92b27", cursor: "pointer" }}>Blablaland</h1>
            </Link>

            <p>Blabla partout, silence nulle part.</p>

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
<<<<<<< HEAD
                        <label htmlFor="identifiant">Identifiant</label>
=======
                        <label htmlFor="identifiant">Identifiant (email)</label>
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
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

<<<<<<< HEAD
=======
                    {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
                    <button type="submit" className="submit-btn">Enregistrement</button>
                    <button type="button" className="reset-btn" onClick={handleReset}>Annuler</button>

                </form>
                <Link to="/connexion">Déjà un compte? Se connecter</Link>
            </div>

            <p className="footer">©BlaBlaLand, Inc. 2025</p>
        </div>
    );
}
<<<<<<< HEAD


=======
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
