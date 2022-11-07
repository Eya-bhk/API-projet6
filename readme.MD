# backend

Mettre les informations des variables d'environnement (pour la connexion à la base de données MongoDB Atlas)

## Pour lancer le serveur:

      `$ npm run start`

## Routes

## la route POST Pour ajouter un nouveau utilisateur:

      http://localhost:3000/api/auth/signup

## la route POST Pour s'enregistrer:

      http://localhost:3000/api/auth/login

## la route POST Pour créer une nouvelle sauce:

      http://localhost:3000/api/sauces

## la route GET Pour afficher la liste des sauces:

      http://localhost:3000/api/sauces

## la route GET Pour afficher une sauce:

      http://localhost:3000/api/sauces/:id

## la route PUT Pour modifier une sauce:

      http://localhost:3000/api/sauces/:id

## la route Delete Pour supprimer une sauce:

      http://localhost:3000/api/sauces/:id

## la route POST Pour aimer ou ne pas aimer une sauce:

      http://localhost:3000/api/sauces/:id/like
