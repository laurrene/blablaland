import React from 'react';

function Register() {
  return (
    <>
      <h2>Inscription</h2>
      <form method="POST" action="/register">
        <input type="text" name="prenom" placeholder="Prénom" required />
        <input type="text" name="nom" placeholder="Nom" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Mot de passe" required />
        <button type="submit">S'inscrire</button>
      </form>
    </>
  );
}

export default Register;
