//importation du package json webtoken
const jwt = require("jsonwebtoken");
//
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; //extraction du token du header Authorization de la requête entrante (bearer[0] [split=retourne un tableau dont les élements sont les sous chaines séparées par le séparateur(espace ici)  ] token[1])
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //décoder notre token
        const userId = decodedToken.userId; //extraire le user id du token
        //création de l'objet auth dans req qui comportera le user id qui sera utilisé dans toutes les requêtes
        req.auth = {
            // rajout du user id à l’objet Request pour que les différentes routes puissent l’exploiter
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
