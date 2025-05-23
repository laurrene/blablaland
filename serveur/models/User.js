const newUser = {
  prenom,
  nom,
  email,
  password: hashedPassword,
  statut: "en_attente",
  favoriteTopics: []
};

await usersCollection.insertOne(newUser);
