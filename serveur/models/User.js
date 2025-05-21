const user = {
  prenom,
  nom,
  email,
  password: hashedPassword,
};

await usersCollection.insertOne(user);
