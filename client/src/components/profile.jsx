import { useState } from 'react';
import '../styles/Profile.css';

function Profile() {
    const [activeSection, setActiveSection] = useState('informations');

    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    return (
        <div style={{ display: 'flex' }}>
            
            <div className="sidebar">
                <h2>Mon Espace</h2>
                <button onClick={() => showSection('informations')}>Informations personnelles</button>
                <button onClick={() => showSection('profil')}>Page de profil (publique)</button>
                <button onClick={() => showSection('topicsPostes')}>Topics postés</button>
                <button onClick={() => showSection('topicsFavoris')}>Topics favoris</button>
                <button onClick={() => showSection('messages')}>Messages envoyés</button>
            </div>

       
            <div className="main-content">
                <h1>Bienvenue sur la page de profil</h1>

                <div className={`content-section ${activeSection === 'informations' ? 'active' : ''}`}>
                    <h2>Informations personnelles</h2>
                    <p>Nom d'utilisateur : LaurreneLI</p>
                    <p>Email : laurrene@example.com</p>
                    <p>Membre depuis : Janvier 2025</p>
                </div>

                <div className={`content-section ${activeSection === 'profil' ? 'active' : ''}`}>
                    <h2>Page de profil (publique)</h2>
                    <p>Bio publique, nombre de publications, avatar, etc.</p>
                </div>

                <div className={`content-section ${activeSection === 'topicsPostes' ? 'active' : ''}`}>
                    <h2>Topics postés</h2>
                    <p>Liste des sujets que vous avez créés.</p>
                </div>

                <div className={`content-section ${activeSection === 'topicsFavoris' ? 'active' : ''}`}>
                    <h2>Topics favoris</h2>
                    <p>Liste des sujets que vous avez mis en favoris.</p>
                </div>

                <div className={`content-section ${activeSection === 'messages' ? 'active' : ''}`}>
                    <h2>Messages envoyés</h2>
                    <p>Historique de vos messages privés envoyés.</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
