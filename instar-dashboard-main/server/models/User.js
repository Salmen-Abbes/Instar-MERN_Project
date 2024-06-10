const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Firstname: {
    type: String
  },
  Lastname: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  password: {
    type: String
  },
  ban: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

const user = mongoose.model('User', userSchema);
module.exports = user;
