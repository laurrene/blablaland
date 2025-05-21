import React from 'react';

function Login() {
  return (
    <>
      <h2>Connexion</h2>
      <form method="POST" action="/login">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
    </>
  );
}

export default Login;
