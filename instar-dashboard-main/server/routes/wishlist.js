const List = require("../models/WishList");
const router = require('express').Router();
const  authenticate = require('../middleware/authenticate')
//create
router.post("/",  async (req, res) => {
    const newList = new List(req.body);
  
    try {
      const savedList = await newList.save();
      res.status(200).json(savedList);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//update
router.put("/:id", authenticate, async (req, res) => {
    try {
      const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedList);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//get list
  router.get("/find/:userId", authenticate, async (req, res) => {
    try {
      const list = await List.findOne({ userId: req.params.userId });
      res.status(200).json(list);
    } catch (err) {
      res.status(500).json(list);
    }
  });




 

module.exports =router