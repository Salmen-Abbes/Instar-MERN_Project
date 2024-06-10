const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');

// Create a new promotion
router.post('/', async (req, res, next) => {
  try {
    const { product, discountPercentage, startDate, endDate } = req.body;
    const newPromotion = new Promotion({
      product,
      discountPercentage,
      startDate,
      endDate,
    });
    const savedPromotion = await newPromotion.save();
    res.status(201).json(savedPromotion);
  } catch (error) {
    next(error);
  }
});

// Get all promotions
router.get('/', async (req, res, next) => {
  try {
    const promotions = await Promotion.find().populate('product');
    res.status(200).json(promotions);
  } catch (error) {
    next(error);
  }
});

// Update a promotion
router.put('/:id', async (req, res, next) => {
  try {
    const { product, discountPercentage, startDate, endDate } = req.body;
    const promotionId = req.params.id;

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      promotionId,
      {
        product,
        discountPercentage,
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json(updatedPromotion);
  } catch (error) {
    next(error);
  }
});

// Delete a promotion
router.delete('/:id', async (req, res, next) => {
  try {
    const promotionId = req.params.id;
    const deletedPromotion = await Promotion.findByIdAndDelete(promotionId);

    if (!deletedPromotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }else{
      return res.status(200).json({message:"Promotion deleted"})
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
