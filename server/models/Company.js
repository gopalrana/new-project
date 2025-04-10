// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  logo: { type: String }, // Image filename
  panNumber: { type: String, required: true },
  gstNumber: { type: String, required: true }
});

module.exports = mongoose.model('Company', companySchema);
