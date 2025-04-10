// Here’s the **complete working Node.js file** with both `/apply-loan` and `/transfer-money-by-user` routes, including the **Loan model**, **CIBIL check**, and **EMI calculation**, all written in a **single file**:

// ---

// ### ✅ `app.js` (Single File Example)
// ```js
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// // Setup app
// const app = express();
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/loanDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Loan model
// const loanSchema = new mongoose.Schema({
//   user: String,
//   amount: Number,
//   termMonths: Number,
//   interestRate: Number,
//   emi: Number,
//   status: { type: String, enum: ['APPROVED', 'PENDING', 'REJECTED'], default: 'PENDING' },
//   createdAt: { type: Date, default: Date.now },
//   isTransferred: { type: Boolean, default: false },
//   transferDate: Date,
//   transferredAmount: Number,
//   bankDetails: {
//     accountHolder: String,
//     accountNumber: String,
//     ifscCode: String,
//     bankName: String
//   }
// });
// const Loan = mongoose.model('Loan', loanSchema);

// // Utility: EMI Calculation
// function calculateEMI(principal, annualRate, months) {
//   const monthlyRate = annualRate / (12 * 100);
//   return Math.round(principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1));
// }

// // Utility: Mock CIBIL Score
// function checkCibilScore(panNumber) {
//   return Math.floor(Math.random() * 300 + 600); // 600–900
// }

// // Route 1: Apply for Loan
// app.post('/apply-loan', async (req, res) => {
//   try {
//     const { amount, termMonths, interestRate, panNumber } = req.body;
//     const userId = 'user123'; // Static user

//     if (!amount || !termMonths || !interestRate || !panNumber) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const now = new Date();
//     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//     const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//     const loanCount = await Loan.countDocuments({
//       user: userId,
//       createdAt: { $gte: firstDay, $lte: lastDay }
//     });

//     if (loanCount >= 3) {
//       return res.status(429).json({ message: 'Limit reached: You can only apply 3 times in a month.' });
//     }

//     const cibilScore = checkCibilScore(panNumber);

//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const recentLoan = await Loan.findOne({
//       user: userId,
//       createdAt: { $gte: thirtyDaysAgo }
//     }).sort({ createdAt: -1 });

//     if (recentLoan && cibilScore < 700) {
//       return res.status(400).json({
//         message: 'CIBIL score still low. Please apply after 90 days.',
//         cibilScore
//       });
//     }

//     if (cibilScore < 700) {
//       return res.status(400).json({
//         message: 'Loan denied due to low CIBIL score',
//         cibilScore
//       });
//     }

//     const emi = calculateEMI(amount, interestRate, termMonths);
//     const loanStatus = cibilScore >= 750 ? 'APPROVED' : 'PENDING';

//     const loan = await Loan.create({
//       user: userId,
//       amount,
//       termMonths,
//       interestRate,
//       emi,
//       status: loanStatus
//     });

//     res.status(201).json({
//       message: `Loan application submitted${loanStatus === 'APPROVED' ? ' and auto-approved' : ''}`,
//       cibilScore,
//       loanId: loan._id,
//       status: loan.status
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Route 2: Transfer Money
// app.post('/transfer-money-by-user', async (req, res) => {
//   try {
//     const { userId, accountHolder, accountNumber, ifscCode, bankName } = req.body;

//     if (!userId || !accountHolder || !accountNumber || !ifscCode || !bankName) {
//       return res.status(400).json({ message: 'All fields including userId and bank info are required' });
//     }

//     const loan = await Loan.findOne({ user: userId, status: 'APPROVED' }).sort({ createdAt: -1 });

//     if (!loan) {
//       return res.status(404).json({ message: 'No approved loan found for this user' });
//     }

//     if (loan.isTransferred) {
//       return res.status(409).json({ message: 'Loan amount already transferred' });
//     }

//     const min = loan.amount * 0.8;
//     const max = loan.amount;
//     const transferredAmount = Math.floor(Math.random() * (max - min + 1) + min);

//     loan.isTransferred = true;
//     loan.transferDate = new Date();
//     loan.transferredAmount = transferredAmount;
//     loan.bankDetails = { accountHolder, accountNumber, ifscCode, bankName };

//     await loan.save();

//     res.json({
//       message: 'Loan amount transferred successfully',
//       loanId: loan._id,
//       transferredAmount,
//       transferDate: loan.transferDate,
//       bankDetails: loan.bankDetails
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error during transfer' });
//   }
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// ```

// ---

// ### 📦 To Run This:
// 1. Ensure MongoDB is running locally (`mongodb://localhost:27017/loanDB`).
// 2. Save the code above to `app.js`.
// 3. Run using:
// ```bash
// npm install express mongoose body-parser
// node app.js
// ```

// ---

// Let me know if you want:
// - MongoDB Atlas version
// - JWT authentication added
// - Frontend with React or Angular
// - Loan repayment simulation logic

// Happy coding! 💻