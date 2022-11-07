//importer le package http de node js pour importer les outils nécéssaires à la création du serveur
const http = require("http");

//importer l'application app.js
const app = require("./app");

// importer le package pour utiliser les variables d'environnement
const dotenv = require("dotenv").config();

//paramétrage du port grace à la méthode set qui attribue le nom du paramètre à la valeur
app.set("port", process.env.PORT);

//création du serveur graçe a creatserver qui prend en argument la fonction qui sera appelée par le serveur(à chaque requête)
const server = http.createServer(app);

// le serveur écoute les requêtes sur le port

server.listen(process.env.PORT);
