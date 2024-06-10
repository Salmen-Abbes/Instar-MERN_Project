const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/ReclamationController');

router.post('/reclamations', reclamationController.createReclamation);
router.get('/reclamations', reclamationController.getAllReclamations);
router.get('/reclamations/:id', reclamationController.getReclamationById);
router.put('/reclamations/:id', reclamationController.updateReclamation);
router.delete('/reclamations/:id', reclamationController.deleteReclamation);

module.exports = router;