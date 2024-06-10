const express = require('express');
const router = express.Router();
const Product3D = require('../models/Product3D');

// Create a new Product3D
router.post('/product3d', async (req, res) => {
  try {
    const { image3D, imageCouleurs } = req.body;
    const product3D = new Product3D({ image3D, imageCouleurs });
    await product3D.save();
    res.status(201).json(product3D);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the Product3D.' });
  }
});
// Get all Product3D items
router.get('/product3d', async (req, res) => {
    try {
      const product3Ds = await Product3D.find();
      res.status(200).json(product3Ds);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Product3D items.' });
    }
  });
// Get a single Product3D by ID
router.get('/product3d/:id', async (req, res) => {
    try {
      const product3D = await Product3D.findById(req.params.id);
      if (!product3D) {
        return res.status(404).json({ error: 'Product3D not found.' });
      }
      res.status(200).json(product3D);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch the Product3D.' });
    }
  });
// Update a Product3D by ID
router.put('/product3d/:id', async (req, res) => {
    try {
      const { image3D, imageCouleurs } = req.body;
      const product3D = await Product3D.findByIdAndUpdate(
        req.params.id,
        { image3D, imageCouleurs },
        { new: true }
      );
      if (!product3D) {
        return res.status(404).json({ error: 'Product3D not found.' });
      }
      res.status(200).json(product3D);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the Product3D.' });
    }
  });
// Delete a Product3D by ID
router.delete('/product3d/:id', async (req, res) => {
    try {
      const product3D = await Product3D.findByIdAndRemove(req.params.id);
      if (!product3D) {
        return res.status(404).json({ error: 'Product3D not found.' });
      }
      res.status(200).json({ message: 'Product3D deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the Product3D.' });
    }
  });
        

module.exports = router;
