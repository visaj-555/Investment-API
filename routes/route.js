const express = require("express");
const router = express.Router();

// Importing all the controllers and functions
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword, 
  forgotPassword,
  resetPassword, 
  newPassword
} = require("../controllers/userController");

const {
  getTopGainers,
  getOverallInvestmentBySector,
  getInvestmentsBySector,
  getInvestmentById,
  getHighestGrowthInSector,
} = require("../controllers/investmentController");

const {
  fixedDepositRegister,
  fixedDepositDelete,
  getFdDetails,
  updateFixedDeposit, 
  deleteMultipleFDs
} = require("../controllers/fdcontroller");

const {
  userRegisterValidate,
  userLoginValidate,
} = require("../validation/userValidator");

const {
  createBank,
  updateBank,
  deleteBank,
  getBanks,
} =  require('../controllers/bankController');

const {
  goldMasterInfoRegister, 
  updateGoldMasterInfo, 
  deleteGoldMasterInfo, 
  getGoldMasterInfo
} = require('../controllers/goldMasterController');

const {
  createGoldRecord,
  getAllGoldRecords,
  getGoldRecordById,
  updateGoldRecord,
  deleteGoldRecord,
  deleteMultipleGoldRecords
} = require('../controllers/goldController');

const {
  getGoldAnalysis
} =  require('../controllers/goldAnalysisController');

const {getOverallAnalysis} =  require('../controllers/overallAnalysis');


const { getFdAnalysis,  getFdAnalysisbyNumber} = require("../controllers/fdAnalysisController");
const { ensureAuthenticated, ensureAdmin } = require("../validation/authValidator");
const { validateFixedDeposit } = require("../validation/fdValidator");
const { upload, multerErrorHandling  } = require("../validation/upload");

// User routes
router.post("/user/login", userLoginValidate, loginUser);
router.post("/user/register", userRegisterValidate, registerUser);
router.get("/users", getUsers);
router.get("/user-profile/:id", ensureAuthenticated, getUser);
router.get("/users/:id", ensureAuthenticated, getUser);
router.put("/user-profile/update/:id", ensureAuthenticated, upload.single('profileImage'), multerErrorHandling, updateUser);
router.delete("/user/delete/:id", ensureAuthenticated, deleteUser);
router.post("/user/changepassword",  ensureAuthenticated, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/newpassword', newPassword);

// Fixed Deposit routes
router.post("/fd/register", ensureAuthenticated, validateFixedDeposit, fixedDepositRegister);
router.post("/fd/create", ensureAuthenticated, validateFixedDeposit, fixedDepositRegister);
router.delete("/fd/delete/:id", ensureAuthenticated, fixedDepositDelete);
router.get("/fds", ensureAuthenticated, getFdDetails);
router.put( "/fd/update/:id", ensureAuthenticated,validateFixedDeposit, updateFixedDeposit);
router.get("/fd/:id", ensureAuthenticated, getFdDetails);
router.get("/fd-analysis", ensureAuthenticated, getFdAnalysis);
router.get("/fd-analysis-number", ensureAuthenticated, getFdAnalysisbyNumber);
router.delete('/fd/delete-multiple', ensureAuthenticated, deleteMultipleFDs);


// Investment routes
router.get("/overall-investment", ensureAuthenticated ,getOverallAnalysis);
router.get("/top-gainers", ensureAuthenticated, getTopGainers);
router.get("/overall-investment-by-sector", ensureAuthenticated, getOverallInvestmentBySector);
router.get("/investments-by-sector/:sector",ensureAuthenticated, getInvestmentsBySector);
router.get("/investments/:id", ensureAuthenticated, getInvestmentById);
router.get("/investments/highest-growth/:sector", ensureAuthenticated, getHighestGrowthInSector);
router.get('/gold-analysis', ensureAuthenticated, getGoldAnalysis);

//Bank routes
router.post('/bank-register',  ensureAuthenticated, ensureAdmin, createBank);
router.put('/bank-update', ensureAuthenticated, ensureAdmin, updateBank);
router.delete('/bank-delete',  ensureAuthenticated, ensureAdmin, deleteBank);
router.get('/banks', ensureAuthenticated, ensureAdmin, getBanks);

// Gold Master routes
router.post("/goldMaster/register", ensureAuthenticated, ensureAdmin,  goldMasterInfoRegister);
router.put("/goldMaster/update/:id",  ensureAuthenticated, ensureAdmin, updateGoldMasterInfo);
router.delete("/goldMaster/delete/:id", ensureAuthenticated, ensureAdmin, deleteGoldMasterInfo);
router.get("/goldMaster", ensureAuthenticated, ensureAdmin, getGoldMasterInfo);

// Gold routes
router.post("/gold/register", ensureAuthenticated,  createGoldRecord);
router.put("/gold/update/:id", ensureAuthenticated, updateGoldRecord);
router.delete("/gold/delete/:id", ensureAuthenticated, deleteGoldRecord);
router.get("/gold-info",ensureAuthenticated, getAllGoldRecords);
router.get("/gold-info/:id", ensureAuthenticated, getGoldRecordById); 
router.delete('/gold/delete-multiple', ensureAuthenticated, deleteMultipleGoldRecords);



module.exports = router;
