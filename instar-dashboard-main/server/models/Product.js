const mongoose = require("mongoose");
const product3DModel = require("../models/Product3D");
const Fournisseur = require("../models/Fournisseur");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 5 },
  subCategory: { type: String },
  image: { type: String },
  image3DInfo: [
    {
      image3D: { type: String },
      imageCouleurs: { type: String },
      quantity: { type: Number, required: true },
    },
  ],
  fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: "Fournisseur" },
  sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sale" }],
});

module.exports = mongoose.model("Product", productSchema);
