const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017/';
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

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Champs manquants" });

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ error: "Utilisateur inconnu" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

    res.json({ message: "Connexion réussie", user: { prenom: user.prenom, nom: user.nom, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { prenom, nom, email, password } = req.body;
    if (!prenom || !nom || !email || !password) return res.status(400).json({ error: "Champs manquants" });

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { prenom, nom, email, password: hashedPassword };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/topics', async (req, res) => {
  try {
    const { user, title, content, timestamp, comments, isFavorite } = req.body;
    const newTopic = {
      user,
      title,
      content,
      timestamp: new Date(timestamp || Date.now()),
      comments: comments || [],
      isFavorite: isFavorite || false,
    };
    const result = await db.collection('topics').insertOne(newTopic);
    res.status(201).json({ _id: result.insertedId, ...newTopic });
  } catch (err) {
    console.error('Erreur serveur (POST /api/topics) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/topics', async (req, res) => {
  try {
    const topics = await db.collection('topics').find({}).toArray();
    res.json(topics);
  } catch (err) {
    console.error('Erreur serveur (GET /api/topics) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});