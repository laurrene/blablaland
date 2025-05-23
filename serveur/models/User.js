const newUser = {
  prenom,
  nom,
  email,
  password: hashedPassword,
  statut: "en_attente" // par défaut à l'inscription
};

await usersCollection.insertOne(user);
