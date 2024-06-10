const Fournisseur = require("../models/Fournisseur");

// Create a new Fournisseur
exports.createFournisseur = async (req, res) => {
  try {
    const { name, address, phone, marque } = req.body;
    const fournisseur = new Fournisseur({ name, address, phone, marque });
    await fournisseur.save();
    res.status(201).json(fournisseur);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the Fournisseur." });
  }
};

// Get all Fournisseurs
exports.getAllFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.find();
    res.status(200).json(fournisseurs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Fournisseurs." });
  }
};

// Get a single Fournisseur by ID
exports.getFournisseurById = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findById(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur not found." });
    }
    res.status(200).json(fournisseur);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the Fournisseur." });
  }
};

// Update a Fournisseur
exports.updateFournisseur = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const fournisseur = await Fournisseur.findByIdAndUpdate(
      req.params.id,
      { name, address, phone },
      { new: true }
    );
    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur not found." });
    }
    res.status(200).json(fournisseur);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the Fournisseur." });
  }
};

// Delete a Fournisseur
exports.deleteFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByIdAndRemove(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ error: "Fournisseur not found." });
    }
    res.status(200).json({ message: "Fournisseur deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the Fournisseur." });
  }
};
