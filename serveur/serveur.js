const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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

// Inscription : statut en attente
app.post('/api/signup', async (req, res) => {
  try {
    const { prenom, nom, email, password } = req.body;
    if (!prenom || !nom || !email || !password)
      return res.status(400).json({ error: "Champs manquants" });

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      prenom,
      nom,
      email,
      password: hashedPassword,
      statut: 'en_attente',
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Inscription réussie, votre compte est en attente de validation." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Connexion
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Champs manquants" });

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ error: "Utilisateur inconnu" });

    if (user.statut === 'en_attente') {
      return res.status(403).json({ error: "Votre compte est en attente de validation par un administrateur." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

    res.json({
      message: "Connexion réussie",
      user: {
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        statut: user.statut
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- ROUTE DÉPLACÉE ICI ---
app.get('/api/users/en-attente', async (req, res) => {
  try {
    const pendingUsers = await usersCollection.find({ statut: 'en_attente' }).toArray();
    res.json(pendingUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer un utilisateur par email
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await usersCollection.findOne({ email }, { projection: { password: 0 } });
    
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    
    res.json(user);
  } catch (err) {
    console.error('Erreur serveur (GET /api/users/:email) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Valider un utilisateur
app.post('/api/users/valider/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { statut: 'membre' } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur validé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Topics
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

app.delete('/api/topics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('topics').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Topic non trouvé' });
    }

    res.status(200).json({ message: 'Topic supprimé avec succès' });
  } catch (err) {
    console.error('Erreur serveur (DELETE /api/topics/:id) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/topics/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { user, content } = req.body;
    
    if (!content) return res.status(400).json({ error: "Le commentaire ne peut pas être vide" });

    const newComment = {
      id: new ObjectId().toString(),
      user,
      content,
      timestamp: new Date(),
    };

    const result = await db.collection('topics').updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: newComment } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Topic non trouvé' });
    }

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Erreur serveur (POST /api/topics/:id/comments) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/topics/:topicId/comments/:commentId', async (req, res) => {
  try {
    const { topicId, commentId } = req.params;
    const { userEmail } = req.body;

    const topic = await db.collection('topics').findOne({ _id: new ObjectId(topicId) });
    if (!topic) return res.status(404).json({ error: 'Topic non trouvé' });

    const comment = topic.comments.find(c => c.id === commentId);
    if (!comment) return res.status(404).json({ error: 'Commentaire non trouvé' });

    if (comment.user !== userEmail) {
      return res.status(403).json({ error: 'Non autorisé - vous ne pouvez supprimer que vos propres commentaires' });
    }

    const result = await db.collection('topics').updateOne(
      { _id: new ObjectId(topicId) },
      { $pull: { comments: { id: commentId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (err) {
    console.error('Erreur serveur (DELETE /api/topics/:topicId/comments/:commentId) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Vérification des droits admin (middleware)
const checkAdmin = async (req, res, next) => {
  try {
    const { userEmail } = req.body;
    const user = await usersCollection.findOne({ email: userEmail });
    
    if (!user || user.statut !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé - droits admin requis' });
    }
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Suppression de topic par admin
app.delete('/api/admin/topics/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('topics').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Topic non trouvé' });
    }

    res.status(200).json({ message: 'Topic supprimé avec succès' });
  } catch (err) {
    console.error('Erreur serveur (DELETE /api/admin/topics/:id) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Suppression de commentaire par admin
app.delete('/api/admin/topics/:topicId/comments/:commentId', checkAdmin, async (req, res) => {
  try {
    const { topicId, commentId } = req.params;

    const result = await db.collection('topics').updateOne(
      { _id: new ObjectId(topicId) },
      { $pull: { comments: { id: commentId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (err) {
    console.error('Erreur serveur (DELETE /api/admin/topics/:topicId/comments/:commentId) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Retourne tous les utilisateurs (sans le champ password)
app.get('/api/users', async (req, res) => {
  try {
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (err) {
    console.error('Erreur serveur (GET /api/users) :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Promouvoir un utilisateur en admin
app.post('/api/users/promouvoir/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { statut: 'admin' } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur promu en admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Rétrograder un admin en membre
app.post('/api/users/retrograder/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { statut: 'membre' } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Admin rétrogradé en membre' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
