const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Setup
const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://gsrvscode:Pln12m2JpEO6cHQm@cluster0.02s1d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Loan Schema
const loanSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  termMonths: Number,
  interestRate: Number,
  emi: Number,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

const Loan = mongoose.model('Loan', loanSchema);

function checkCibilScore(panNumber) {
    if (!panNumber || panNumber.length !== 10) return null;
    const score = Math.floor(Math.random() * (800 - 600 + 1)) + 600; // Random between 600–800
    return score;
  }
  

// EMI Calculation
function calculateEMI(principal, rate, termMonths) {
  const monthlyRate = rate / (12 * 100);
  return parseFloat((
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  ).toFixed(2));
}

// Apply Loan Route
app.post('/apply-loan', async (req, res) => {
  try {
    const { amount, termMonths, interestRate, panNumber } = req.body;
    const userId = 'user123'; // static mock user

    if (!amount || !termMonths || !interestRate || !panNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Check how many loans this user has applied for this month
        const loanCountThisMonth = await Loan.countDocuments({
        user: userId,
        createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth
        }
        });

        if (loanCountThisMonth >= 3) {
        return res.status(429).json({
            message: 'Limit reached: You can only apply 3 times in a month.'
        });
        }

    const cibilScore = checkCibilScore(panNumber);

    // Check last loan in 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLoan = await Loan.findOne({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    if (recentLoan && cibilScore < 700) {
      return res.status(400).json({
        message: 'CIBIL score still low. Please apply after 90 days.',
        cibilScore
      });
    }

    if (cibilScore < 700) {
      return res.status(400).json({
        message: 'Loan denied due to low CIBIL score',
        cibilScore
      });
    }

    const emi = calculateEMI(amount, interestRate, termMonths);

    const loanStatus = cibilScore >= 750 ? 'APPROVED' : 'PENDING';

    const loan = await Loan.create({
      user: userId,
      amount,
      termMonths,
      interestRate,
      emi,
      status: loanStatus
    });

    res.status(201).json({
      message: `Loan application submitted${loanStatus === 'APPROVED' ? ' and auto-approved' : ''}`,
      cibilScore,
      loan
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get All Loans (list)
app.get('/loans', async (req, res) => {
    try {
      const userId = 'user123'; // mock user

      const loans = await Loan.find({ user: userId }).sort({ createdAt: -1 });
      res.json({
        message: 'Loan list fetched successfully',
        total: loans.length,
        loans
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while fetching loans' });
    }
  });
  

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:5000');
});


