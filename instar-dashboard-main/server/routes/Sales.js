const express = require("express");
const router = express.Router();
const saleController = require("../controllers/SalesController");
const Sale = require("../models/Sales");

router.get("/sales/:productId", saleController.recordSale);

//update status
router.put("/sales/:saleId/status", saleController.updateSaleStatus);
router.get("/stats/summary", saleController.getSalesSummary);
router.get("/stats/delivered-summary", saleController.getDeliveredSalesSummary);
router.get("/totalAvailableProducts", saleController.getTotalAvailableProducts);

router.get('/calculations/:userId', saleController.getSalesStatsByUser);

router.post("/create", async (req, res) => {
  try {
    const { productId, fournisseurId, UserId, quantity } = req.body;

    const sale = new Sale({
      productId,
      fournisseurId,
      UserId,
      quantity,
    });

    await sale.save();

    res.status(201).json({ message: "success sale", sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get all sales
router.get("/sales", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales." });
  }
});

module.exports = router;
