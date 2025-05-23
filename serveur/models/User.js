const newUser = {
  prenom,
  nom,
  email,
  password: hashedPassword,
  statut: "en_attente", // par défaut à l'inscription
  favoriteTopics: []    // initialise le tableau vide à l'inscription
};

await usersCollection.insertOne(newUser);
