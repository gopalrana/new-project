// server.js
const express = require('express');
const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');
const Company = require('./models/Company');
const path = require('path');
const cors = require('cors');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/company', companyRoutes);

// Render HTML page with company list
app.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.render('companyList', { companies });
  } catch (err) {
    res.status(500).send('Error fetching companies');
  }
});


// Render HTML page with company list
app.get('/new-companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.render('companyList', { companies });
  } catch (err) {
    res.status(500).send('Error fetching companies');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
