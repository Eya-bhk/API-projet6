//importer le package bcrypt qui permet de hacher le mot de pass
const bcrypt = require("bcrypt");
//importer le modele user crée
const User = require("../models/user");
//importer le package jsonwebtoken qui permet de générer un token d'authentification
const jwt = require("jsonwebtoken");

//définir la fonction qui permet de créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    //hacher le mot de pass
    bcrypt
        .hash(req.body.password, 10)
        //definir le nv utilisateur
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            //enregistrer le nv utilisateur dans la BD
            user.save()
                .then(() =>
                    res
                        .status(201)
                        .json({ message: " nouveau utilisateur ajouté" })
                )
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//définir la fonction login qui va vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides
exports.login = (req, res, next) => {
    // la méthode findone permet de chercher dans la base de données l'utilisateur identifié par l'email transmis dans le body de la req
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user === null) {
                // email non enregistré dans la base de données
                return res
                    .status(401)
                    .json({ message: "Paire login/mot de passe incorrecte" });
            } else {
                //comparer le mot de pass transmis dans la req au MDP enregistré dans la BD
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            //MDP invalid
                            return res.status(401).json({
                                message: "Paire login/mot de passe incorrecte",
                            });
                        } else {
                            //MDP valid donc on definit un objet contenant l'ID utilisateur et un token
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    // fonction sign permet de chiffrer un nouveau token
                                    { userId: user._id },
                                    "RANDOM_TOKEN_SECRET", //crypter notre token en le remplaçant  par une chaîne aléatoire beaucoup plus longue
                                    { expiresIn: "24h" }
                                ),
                            });
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
