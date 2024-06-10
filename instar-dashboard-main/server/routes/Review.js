const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// create
router.post('/products/:productId/reviews', (req, res) => {
  const { productId } = req.params;
  const { user, rating, comment , image} = req.body;

  const newReview = new Review({
    user: user, 
    product: productId, 
    rating: rating,
    comment: comment,
    image: image,
  });

  newReview.save()
    .then((review) => {
      res.json({ message: 'Avis ajouté avec succès', review });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis', error });
    });
});


//get all 
router.get('/products/:productId/reviews', (req, res) => {
    const { productId } = req.params;
  
    Review.find({ product: productId })
      .populate('user', 'Firstname Lastname') 
      .exec()
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((error) => {
        res.status(500).json({ message: 'Erreur lors de la récupération des avis', error });
      });
  });


  // update
router.put('/reviews/:reviewId', (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
  
    Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true })
      .exec()
      .then((updatedReview) => {
        res.json({ message: 'Rating added', review: updatedReview });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'avis', error });
      });
  });


  // delete
router.delete('/reviews/:reviewId', (req, res) => {
    const { reviewId } = req.params;
  
    Review.findByIdAndDelete(reviewId)
      .exec()
      .then(() => {
        res.json({ message: 'Rating deleted' });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'avis', error });
      });
  });


  module.exports = router;