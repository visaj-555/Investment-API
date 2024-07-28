const express = require('express');
const router = express.Router();

// Importing all the controllers and functions
const { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser, fetchExternalData } = require('../controllers/userController');
const { getTopGainers, getOverallInvestmentBySector, getInvestmentsBySector, getInvestmentById, getHighestGrowthInSector } = require('../controllers/investmentController');
const { fixedDepositRegister, fixedDepositDelete, getFdDetails, updateFixedDeposit, getFdById } = require('../controllers/fdcontroller'); // Use the correct casing here
const { userRegisterValidate, userLoginValidate } = require('../middlewares/userValidator');
const { getFdAnalysis } = require('../controllers/fdAnalysisController');
const { ensureAuthenticated } = require('../middlewares/authValidator');
const { validateFixedDeposit } = require('../middlewares/fdValidator');

// User routes
router.post('/user/login', userLoginValidate, loginUser);
router.post('/user/register', userRegisterValidate, registerUser);
router.get('/users', getUsers);
router.get('/users/:id', ensureAuthenticated, getUser);
router.put('/user/update', ensureAuthenticated, userRegisterValidate, updateUser);
router.delete('/users/delete', ensureAuthenticated, deleteUser);
router.get('/users/getExternalData', fetchExternalData);

// Fixed Deposit routes
router.post('/fd/register', ensureAuthenticated, validateFixedDeposit, fixedDepositRegister);
router.delete('/fd/delete', ensureAuthenticated, fixedDepositDelete);
router.get('/fds', ensureAuthenticated, getFdDetails);
router.put('/fd/update', ensureAuthenticated, validateFixedDeposit, updateFixedDeposit);
router.get('/fd/id', ensureAuthenticated, getFdById);
router.get('/fd-analysis', ensureAuthenticated, getFdAnalysis);

// Investment routes
router.get('/top-gainers', ensureAuthenticated, getTopGainers);
router.get('/overall-investment-by-sector', ensureAuthenticated, getOverallInvestmentBySector);
router.get('/investments-by-sector', ensureAuthenticated, getInvestmentsBySector);
router.get('/investments', ensureAuthenticated, getInvestmentById);
router.get('/investments/highest-growth', ensureAuthenticated, getHighestGrowthInSector);

module.exports = router;
