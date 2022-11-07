//importer mongoose pour créer le model utilisateur
const mongoose = require("mongoose");
//importer le package mongoose-unique-validator pour prévalider les informations avant de les enregistrer
const uniqueValidator = require("mongoose-unique-validator");

//création du schéma utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
//passer le validateur unique en plugin qui sera appliqué sur chaque utilisateur pour vérifier de l'unicité du mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
