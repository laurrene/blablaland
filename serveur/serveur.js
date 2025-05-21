const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const uri = 'mongodb+srv://candya:59Cpsxl2NyGf1UnG@blablaland.j7jbyqi.mongodb.net/blablaland?retryWrites=true&w=majority';

const client = new MongoClient(uri);

let db, usersCollection;

async function startServer() {
  try {
    await client.connect();
    db = client.db('blablaland');
    usersCollection = db.collection('users');

    console.log('MongoDB connecté');

    app.listen(3000, () => {
      console.log('Serveur démarré sur http://localhost:3000');
    });
  } catch (err) {
    console.error('Erreur de connexion MongoDB :', err);
  }
}

startServer();

// Connexion
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentative de connexion :", email);  // <-- LOG ICI

    if (!email || !password) return res.status(400).json({ error: "Champs manquants" });

    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log("Utilisateur introuvable !");
      return res.status(401).json({ error: "Utilisateur inconnu" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("Mot de passe invalide !");
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    console.log("Connexion réussie !");
    res.json({ message: "Connexion réussie", user: { prenom: user.prenom, nom: user.nom, email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// Inscription
app.post('/api/signup', async (req, res) => {
  try {
    const { prenom, nom, email, password } = req.body;
    if (!prenom || !nom || !email || !password)
      return res.status(400).json({ error: "Champs manquants" });

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      prenom,
      nom,
      email,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
