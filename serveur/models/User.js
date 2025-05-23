const user = {
  prenom,
  nom,
  email,
  password: hashedPassword,
  statut: 'membre', // ou 'admin' si besoin
};

await usersCollection.insertOne(user);
