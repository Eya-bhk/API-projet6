const Sauce = require("../models/sauces");
const mongoose = require("mongoose");
//importation du package fs(file system) pour utiliser ses fonctions dans la suppression d'images
const fs = require("fs");
/*const user = require("../models/user");*/

//définir la fonction qui permet d'ajouter une nouvelle sauce
exports.creatSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //analyse la requête au format JSON et renvoie la valeur sous la forme form-data
    delete sauceObject._id; //supprimer l'id de la requête
    delete sauceObject._userId; // supprimer le userId pour le remplacer par le userId extrait du token
    const sauce = new Sauce({
        ...sauceObject, //extraire les valeur de la requête après la suppression des eléments
        userId: req.auth.userId, // ajouter userId dont la valeur est extraite du token
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`, // reconstruire l'URL complète de l'image enregistré
    });
    sauce
        .save()
        .then(() => {
            res.status(201).json({
                message: "la sauce a été ajoutée avec succès",
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

//définir la fonction qui permet d'afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

//définir la fonction qui permet d'afficher une seule saucce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};
//définir la fonction qui permet de modifier une sauce encas de présence de fichier ou pas
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce), // en cas deprésence d'un fichier image
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body }; //en cas d'absence de fichier image
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Non autorisé" });
            } else {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...sauceObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: "sauce modifiée!" })
                    )
                    .catch((error) => res.status(403).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//définir la fonction qui permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // selectionner la sauce à supprimer par l'ID
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                //comparer le userid venant de la requete et celui enregistré dans la BDD
                res.status(403).json({ message: "Non autorisé" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1]; //split permet de diviser une chaine de caractère et de retourner un tableau
                fs.unlink(`images/${filename}`, () => {
                    // unlink méthode permettant de supprimer une image
                    Sauce.deleteOne({ _id: req.params.id }) // fonction mongoose pour supprimer la sauce
                        .then(() => {
                            res.status(200).json({
                                message: "la sauce a été supprimée !",
                            });
                        })
                        .catch((error) => res.status(403).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

//définir la fonction qui permet de liker ou disliker une sauce
exports.likeSauce = (req, res, next) => {
    //récupérer l'id de l'url de la requête
    // chercher la sauce qui va étre liker ou disliker correspondant à l'id dans la BD
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //liker
            // vérifier que l'user qui va liker n'est pas déja présent dans le tableau userLiked et que like=1

            if (
                !sauce.usersLiked.includes(req.body.userId) && //récupérer l'id de l'url de la requête
                req.body.like === 1
            ) {
                console.log(req.body.userId);
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 }, // $inc opérateur mongoDB qui incrémente le champ Likes d'une valeur spécifiée(1)
                        $push: { usersLiked: req.body.userId }, //$push opérateur qui ajoute une valeur spécifiée à un tableau
                    }
                )

                    .then(() =>
                        res
                            .status(201)
                            .json({ message: "Evaluation prise en compte" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }

            //si l'utilisateur supprime le like( like=0)
            if (
                sauce.usersLiked.includes(req.body.userId) && //récupérer l'id de l'url de la requête
                req.body.like === 0
            ) {
                console.log(req.body.userId);
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 }, // $inc opérateur mongoDB qui incrémente le champ Likes d'une valeur spécifiée(1)
                        $pull: { usersLiked: req.body.userId }, //$pull opérateur qui supprime une valeur spécifiée à un tableau
                    }
                )

                    .then(() =>
                        res
                            .status(201)
                            .json({ message: "Evaluation prise en compte" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }

            //disliker ( like=-1=> dislikes=+1)
            if (
                !sauce.usersDisliked.includes(req.body.userId) && //récupérer l'id de l'url de la requête
                req.body.like === -1
            ) {
                console.log(req.body.userId);
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 }, // $inc opérateur mongoDB qui incrémente le champ Likes d'une valeur spécifiée(1)
                        $push: { usersDisliked: req.body.userId }, //$push opérateur qui ajoute une valeur spécifiée à un tableau
                    }
                )

                    .then(() =>
                        res
                            .status(201)
                            .json({ message: "Evaluation prise en compte" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }

            //si l'utilisateur supprime le dislike
            if (
                sauce.usersDisliked.includes(req.body.userId) && //récupérer l'id de l'url de la requête
                req.body.like === 0
            ) {
                console.log(req.body.userId);
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: -1 }, // $inc opérateur mongoDB qui incrémente le champ Likes d'une valeur spécifiée(1)
                        $pull: { usersDisliked: req.body.userId }, //$pull opérateur qui supprime une valeur spécifiée à un tableau
                    }
                )

                    .then(() =>
                        res
                            .status(201)
                            .json({ message: "Evaluation prise en compte" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(404).json({ error }));
};
