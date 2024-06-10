const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: Number, required: true },
  marque :{type:String ,required : true}

});

const Fournisseur = mongoose.model('Fournisseur', fournisseurSchema);

module.exports = Fournisseur;