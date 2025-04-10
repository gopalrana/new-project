// routes/companyRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Company = require('../models/Company');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST /api/company
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { companyName, panNumber, gstNumber } = req.body;
    const logo = req.file ? req.file.filename : null;

    const newCompany = new Company({ companyName, panNumber, gstNumber, logo });
    await newCompany.save();

    res.status(201).json({ message: '✅ Company created!', company: newCompany });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Failed to create company' });
  }
});

module.exports = router;
