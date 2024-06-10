const express = require('express');
const router = express.Router();
const fournisseurController = require('../controllers/FournisseurController');
//fournisseur routes
router.post('/fournisseurs', fournisseurController.createFournisseur);
router.get('/fournisseurs', fournisseurController.getAllFournisseurs);
router.get('/fournisseurs/:id', fournisseurController.getFournisseurById);
router.put('/fournisseurs/:id', fournisseurController.updateFournisseur);
router.delete('/fournisseurs/:id', fournisseurController.deleteFournisseur);

module.exports = router;
