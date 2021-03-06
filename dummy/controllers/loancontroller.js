import { userStore, loanStore, repaymentStore } from '../datastore';
import Loans from '../models/loan';
import Repayments from '../models/repayment';

export default {
  createLoan: (req, res) => {
    const { email } = req.user;
    const user = userStore.find(signedUser => signedUser.email === email);
    if (user.status === 'unverified') {
      return res.status(400).json({
        status: 400,
        error: 'You are not yet a verified user.'
      });
    }

    const existingLoans = loanStore.filter(loan => loan.user === email);
    const outstandingLoan = existingLoans
      .filter(loan => loan.repaid === false && loan.status !== 'rejected');
    if (outstandingLoan.length > 0) {
      return res.status(402).json({
        status: 402,
        error: 'You have an outstanding loan'
      });
    }

    req.body.user = email;
    req.body.id = loanStore.length > 0 ? loanStore[loanStore.length - 1].id + 1 : 1;
    const loan = new Loans(req.body);
    loanStore.push(loan);
    return res.status(201).json({
      status: 201,
      message: 'Loan application record created successfully!',
      data: loan
    });
  },

  getAllLoans: (req, res) => {
    const { status, repaid } = req.query;
    if (status && repaid) {
      const data = loanStore
        .filter(loan => loan.status === status && loan.repaid === JSON.parse(repaid));
      return res.status(200).json({
        status: 200,
        message: 'Successfully retrieved data!',
        data
      });
    }

    if (status || repaid) {
      const data = loanStore
        .filter(loan => loan.status === status || loan.repaid === JSON.parse(repaid));
      return res.status(200).json({
        status: 200,
        message: 'Successfully retrieved data!',
        data
      });
    }
    const response = res.status(200).json({
      status: 200,
      message: 'Successfully retrieved all loan records',
      data: loanStore
    });
    return response;
  },

  getLoanById: (req, res) => {
    const loan = loanStore.find(singleLoan => singleLoan.id === parseInt(req.params.id, 10));
    if (!loan) {
      return res.status(404).json({
        status: 404,
        error: 'Loan record not found'
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Successfully retrieved loan record!',
      data: loan
    });
  },

  updateLoan: (req, res) => {
    const loan = loanStore.find(singleLoan => singleLoan.id === parseInt(req.params.id, 10));
    if (!loan) {
      return res.status(404).json({
        status: 404,
        error: 'Loan record not found'
      });
    }
    loan.status = req.body.status;
    return res.status(200).json({
      status: 200,
      message: 'Successfully updated loan status!',
      data: {
        loanid: loan.id,
        loanAmount: loan.amount,
        tenor: loan.tenor,
        status: loan.status,
        monthlyInstallment: loan.paymentInstallment,
        interest: loan.interest
      }
    });
  },

  createLoanRepayment: (req, res) => {
    const paidAmount = parseFloat(req.body.paidAmount);

    const loan = loanStore.find(singleLoan => singleLoan.id === parseInt(req.params.id, 10));
    if (!loan) {
      return res.status(404).json({
        status: 404,
        error: 'Loan record not found'
      });
    }

    if (paidAmount > loan.balance) {
      return res.status(400).json({
        status: 400,
        error: `your loan balance is ${loan.balance}!`,
      });
    }

    const balance = loan.balance - paidAmount;

    req.body.id = repaymentStore.length > 0 ? repaymentStore[repaymentStore.length - 1].id + 1 : 1;
    req.body.paidAmount = paidAmount;
    req.body.loanId = loan.id;
    req.body.amount = loan.amount;
    req.body.monthlyInstallment = loan.paymentInstallment;
    req.body.balance = balance;

    const repayment = new Repayments(req.body);

    loan.balance = balance; // update balance
    if (loan.balance === 0) {
      loan.repaid = true;
    }

    repaymentStore.push(repayment);
    return res.status(201).json({
      status: 201,
      message: 'Repayment record is successfully created!',
      data: repayment
    });
  },

  getLoanRepaymentHistory: (req, res) => {
    const loanId = req.params.id;

    const loanRecord = repaymentStore.filter(history => history.loanId === parseInt(loanId, 10));
    if (!loanRecord) {
      return res.status(404).json({
        status: 404,
        error: 'record not found',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Successfully retrieved repayment history record!',
      data: loanRecord,
    });
  }
};
