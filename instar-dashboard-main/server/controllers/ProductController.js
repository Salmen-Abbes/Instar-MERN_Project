// controllers/productController.js
const Product = require("../models/Product");
const Product3D = require("../models/Product3D");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    console.log(newProduct);
    newProduct.image3DInfo = Array.from(req.body["image3DInfo"]);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the product." });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

// Get  single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the product." });
  }
};

// Update
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the product." });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the product." });
  }
};

// get by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for this category." });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products by category." });
  }
};
// get by category and sub category
exports.getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subCategory } = req.params;
    const products = await Product.find({ category, subCategory });
    if (products.length === 0) {
      return res.status(404).json({
        error: "No products found for this category and subcategory.",
      });
    }
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch products by category and subcategory." });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const uniqueCategories = await Product.distinct("category");
    res.status(200).json(uniqueCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unique categories." });
  }
};
