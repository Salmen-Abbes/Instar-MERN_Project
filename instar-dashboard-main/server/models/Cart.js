const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {   
      type: mongoose.ObjectId,
      ref: "User",    
      required: true
    },
    products: [
      {   
        productId: {
          type: mongoose.ObjectId,
          ref: "Product",    
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);