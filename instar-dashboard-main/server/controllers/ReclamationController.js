const Reclamation = require('../models/Reclamation');
//const moment = require('moment')

exports.createReclamation = async (req, res) => {
  try {
    const { user, product, description } = req.body;

    const newReclamation = new Reclamation({
      user,
      product,
      description,
    });
   // newReclamation.status[0]={"status":"confirmation","date":moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}
    await newReclamation.save();

    res.status(201).json({ message: 'Réclamation créée avec succès', reclamation: newReclamation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la réclamation', error: error.message });
  }
};

exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find();
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réclamations', error: error.message });
  }
};

exports.getReclamationById = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ error: 'Réclamation non trouvée.' });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la réclamation', error: error.message });
  }
};

exports.updateReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reclamation) {
      return res.status(404).json({ error: 'Réclamation non trouvée.' });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la réclamation', error: error.message });
  }
};

exports.deleteReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findByIdAndRemove(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ error: 'Réclamation non trouvée.' });
    }
    res.status(200).json({ message: 'Réclamation supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la réclamation', error: error.message });
  }
};
