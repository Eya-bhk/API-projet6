//importer express
const express = require("express");
//créer l'application express
const app = express();

//importer le fichier db pour se connecter à la base de données
const mongoose = require("./db/dbase.js");

//appel des middlewares
// importation morgan pour logger les requêtes http
// const logger = require("morgan");
// importation body parser pour transormer le corps de la req et res d'une chaine de caractère au format json
const bodyParser = require("body-parser");

// importation du router user
const userRoutes = require("./routes/user");

//importation des routes sauces
const saucesRoutes = require("./routes/sauces");

// utiliser les middlewares pour les requêtes et les réponses
// morgan
// app.use(logger("dev")) //paramètre par défaut(couleur selon réponse); next intégré

app.use(bodyParser.json()) //transormer la chaine de caractère au format json (req et resp)
    //midelware pour ajouter des headers à notre objet response pour  autoriser les appels HTTP entre des serveurs différents (CORS)
    .use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        );
        next();
    });
//utiliser le parcours(router) utilisateur
app.use("/api/auth", userRoutes);

//utiliser le parcours(router) sauces
app.use("/api/sauces", saucesRoutes);

// Configuration le serveur pour renvoyer des fichiers statiques pour une route donnée
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "images")));

//exportation de app.js pour qu'il puisse être utilisé à partir d'autres fichiers
module.exports = app;
