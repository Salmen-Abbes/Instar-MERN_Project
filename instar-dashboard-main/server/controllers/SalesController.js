const Sale = require("../models/Sales");
const Product = require("../models/Product");

exports.recordSale = async (req, res) => {
  try {
    const { productId, fournisseurId, quantity, status } = req.body;

    const sale = new Sale({ productId, fournisseurId, quantity, status });
    await sale.save();

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    product.sales.push(sale._id);
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: "Failed to record the sale." });
  }
};

exports.updateSaleStatus = async (req, res) => {
  const { saleId } = req.params;
  const { status } = req.body;

  try {
    const sale = await Sale.findById(saleId);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    sale.status = status;
    await sale.save();

    res.status(200).json({ message: "Sale status updated successfully", sale });
  } catch (error) {
    res.status(500).json({ message: "Error updating sale status", error });
  }
};

exports.getSalesSummary = async (req, res) => {
  try {
    const summary = await Sale.aggregate([
      {
        $group: {
          _id: { fournisseurId: "$fournisseurId", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.fournisseurId",
          sales: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      {
        $lookup: {
          from: "fournisseurs",
          localField: "_id",
          foreignField: "_id",
          as: "fournisseur",
        },
      },
      {
        $unwind: "$fournisseur",
      },
      {
        $project: {
          _id: 0,
          fournisseurId: "$_id",
          fournisseurName: "$fournisseur.name",
          sales: 1,
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: "Failed to get sales summary." });
  }
};

exports.getDeliveredSalesSummary = async (req, res) => {
  try {
    const summary = await Sale.aggregate([
      {
        $match: { status: "Livrée" },
      },
      {
        $group: {
          _id: "$fournisseurId",
          totalDelivered: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "fournisseurs",
          localField: "_id",
          foreignField: "_id",
          as: "fournisseur",
        },
      },
      {
        $unwind: "$fournisseur",
      },
      {
        $project: {
          _id: 0,
          fournisseurId: "$_id",
          fournisseurName: "$fournisseur.name",
          totalDelivered: 1,
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: "Failed to get delivered sales summary." });
  }
};

exports.getTotalAvailableProducts = async (req, res) => {
  try {
    // Récupérer tous les produits
    const products = await Product.find();

    // Initialiser les compteurs pour les produits disponibles et non disponibles
    let available = 0;
    let unavailable = 0;

    // Parcourir les produits et compter les disponibles et non disponibles en fonction de la quantité
    products.forEach((product) => {
      if (product.quantity > 0) {
        available++;
      } else {
        unavailable++;
      }
    });

    // Envoyer la réponse avec le total des produits disponibles et non disponibles
    res.status(200).json({ available, unavailable });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch total available products." });
  }
};
