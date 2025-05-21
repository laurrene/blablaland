<<<<<<< HEAD
import  { useState } from "react";
import "../styles/Login.css";
import { Link } from 'react-router-dom';

export default function ConnexionForm() {
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");

    const handleSubmit = (e) => {
=======
import { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from 'react-router-dom';

export default function ConnexionForm({ setIsLoggedIn }) {
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
        e.preventDefault();

        if (!identifiant || !password) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        setErreur("");
<<<<<<< HEAD
        alert("Connexion réussie !");
=======
        try {
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: identifiant, password }),
            });

            const data = await res.json();

            if (!res.ok) {
            setErreur(data.error || "Erreur lors de la connexion");
            } else {
                alert("Connexion réussie !");
                localStorage.setItem('isLoggedIn', 'true');  // <-- Stocke la connexion persistante
                setIsLoggedIn(true);
                navigate("/forum");
            }

        } catch (err) {
            setErreur("Erreur réseau");
        }
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
    };

    const handleReset = () => {
        setIdentifiant("");
        setPassword("");
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
<<<<<<< HEAD
=======
                    {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
                    <button type="submit" className="submit-btn">Se connecter</button>
                    <button type="button" className="reset-btn" onClick={handleReset}>Annuler</button>
                </form>
                <Link to="/inscription">Pas de compte ? S'inscrire</Link>
<<<<<<< HEAD

=======
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
            </div>

            <p className="footer">© BlaBlaLand, Inc. 2025</p>
        </div>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
