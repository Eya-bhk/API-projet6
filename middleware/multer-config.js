//importer le package multer qui va se charger de gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer");
//créer le dictionnaire qui va permettre d'identifier l'extension du fichier entrant
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};
//initiation de la constante qui va définir l'emplacement de stokage et le nom du fichier entrant
const storage = multer.diskStorage({
    //diskStorage configure le chemin et le nom de fichier pour les fichiers entrants.
    destination: (req, file, callback) => {
        //l'emplacement
        callback(null, "images"); // stockage dans le dossier images
    },
    filename: (req, file, callback) => {
        // renommer le fichier
        const name = file.originalname.split(" ").join("_"); // extraire le nom original, supprimer les espaces et joindre avec _
        const extension = MIME_TYPES[file.mimetype]; //ajouter l'extension à partir du mimetype du fichier
        callback(null, name + Date.now() + "." + extension); // définir le nom du fichier en concaténant le name et l'extension avec le nombre de millisecondes écoulées depuis le 1er Janvier 1970 pour avoir un nom unique
    },
});
//exportation de l'élément multer entièrement configuré, en lui passons la constante storage et en lui indiquant qu'il doit uniquement gérer les téléchargements de fichiers image
module.exports = multer({ storage: storage }).single("image");
