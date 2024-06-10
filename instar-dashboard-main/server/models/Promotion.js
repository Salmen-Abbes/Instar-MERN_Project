const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  discountPercentage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image :{ type: String, required: true }
});

module.exports = mongoose.model('Promotion', promotionSchema);
