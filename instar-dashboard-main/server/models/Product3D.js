const mongoose = require('mongoose');

const product3DSchema = new mongoose.Schema({
  image3D: { type: String },
  imageCouleurs: [{ 
    type: String ,
    enum:['Rouge','Vert','Bleu'],
    default:'Rouge'}] 
});

module.exports = mongoose.model('Product3D', product3DSchema);


