const express = require("express");
const auth = require("../middleware/auth"); //importer le middleware d'authentification
const multer = require("../middleware/multer-config"); //importer le middleware de gestion de fichiers
const router = express.Router(); // définir la classe router

const sauceController = require("../controllers/sauces");

router.post("/", auth, multer, sauceController.creatSauce);
router.get("/", auth, sauceController.getAllSauces);
router.get("/:id", auth, sauceController.getOneSauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.put("/:id", auth, multer, sauceController.modifySauce);
router.post("/:id/like", auth, sauceController.likeSauce);

module.exports = router;
