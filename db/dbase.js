//importer mongoose pour se connecter à la base de données MongoDB
const mongoose = require("mongoose");
//importer le fichier pour pouvoir utiliser les variables d'environnement
const dotenv = require("dotenv").config();
// se connecter à la base de données crée sur mangoDB Atlas graçe à mongoose
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

//exportation de mongoose pour qu'il puisse être utilisé à partir d'autres fichiers

module.exports = mongoose;

//mongodb+srv://first-cluster:<password>@cluster0.rukylma.mongodb.net/?retryWrites=true&w=majority
