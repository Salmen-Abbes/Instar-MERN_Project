const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    userId: {   
      type: mongoose.ObjectId,
      ref: "User",    
      required: true
    },

    products: 
    [{

    
      productsId:{ 
        
          type: mongoose.ObjectId,
          ref: "Product",    
        
      
      },
    }
    ]
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("wishlsit", ListSchema);