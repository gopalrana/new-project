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


app.use(cors({
  origin: 'http://localhost:6000', // or the exact port where your frontend is hosted
}));



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



// Route to handle /comp?page=1,2,...
app.get('/comp', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const allCompanies = await Company.find(); // or however you fetch your companies
    const totalCompanies = allCompanies.length;
    const totalPages = Math.ceil(totalCompanies / limit);

    const startIndex = (page - 1) * limit;
    const paginatedCompanies = allCompanies.slice(startIndex, startIndex + limit);

    res.render('comp', {
      companies: paginatedCompanies,
      totalPages: totalPages,
      currentPage: page
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});





// // Render HTML page with company list
// app.get('/new-companies', async (req, res) => {
//   try {
//     const companies = await Company.find();
//     res.json({
//       status:"Success",
//       data:app.get('/companies', async (req, res) => {
//         try {
//           const companies = await Company.find();
//           res.render('companyList', { companies });
//         } catch (err) {
//           res.status(500).send('Error fetching companies');
//         }
//       });
//     })

//   } catch (err) {
//     res.status(500).send('Error fetching companies');
//   }
// });

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
