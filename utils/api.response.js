//  utils/api.response.js

const statusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
const message = {
  // Area Price  
  areaPriceCreated: "Area Price Added Successfully",
  areaPriceDeleted: "Area Price Deleted Successfully",
  areaPriceRetrieved: "Area price retrieved successfully",
  areaPriceUpdated: "Area Price Updated Successfully",
  areaPricesDeleted: "Multiple Area Price Info Deleted Successfully",
  areaPriceAlreadyExists: "Area Price Already exists",
  errorCreatingAreaPrice: "Error Adding Area Price",
  errorDeletingAreaPrice: "Error Deleting Area Price",
  errorDeletingAreaPrices: "Error Deleting Multiple Area Price Info",
  errorFetchingAreaPrice: "Error Fetching Area Price",
  errorUpdatingAreaPrice: "Error Updating Area Price",

  // Banks
  bankCreated: "Bank created Successfully",
  bankDeleted: "Bank deleted successfully",
  bankUpdated: "Bank updated successfully",
  bankView: "Bank retrieved successfully",
  banksDeleted: "Banks deleted successfully",
  banksView: "Banks retrieved successfully",
  bankAlreadyExists: "Bank already exists",
  errorCreatingBank: "Error creating Bank",
  errorDeletingBank: "Error deleting Bank",
  errorDeletingBanks: "Error deleting Banks",
  errorFetchingBank: "Error fetching Bank",
  errorFetchingBanks: "Error fetching Banks",
  errorUpdatingBank: "Error updating Bank",

  // City
  citiesView: "Cities retrieved successfully",
  cityCreated: "City registered successfully",
  cityDeleted: "City deleted successfully",
  cityUpdated: "City updated successfully",
  cityAlreadyExists: "City already exists",
  cityNotFound: "City not found",
  errorCreatingCity: "Error creating city",
  errorDeletingCity: "Error deleting city",
  errorFetchingCities: "Error fetching cities",
  errorUpdatingCity: "Error updating city",

  // Dashboard
  combinedNumAnalysis: "Combined Analysis of All Sectors in Numbers",
  highestGrowthinSector: "Highest Growth in Sector",
  investmentBySector: "Investment By Sector Retrieved Successfully",
  overAllAnalysis: "Overall Analysis of All Sectors",
  topGainers: "Top 5 Gainers of all the Sectors",
  errorCombinedNumAnalysis: "Error Fetching Combined Analysis in Numbers",
  errorFetchingHighestGrowth: "Error fetching Highest Growth in Sector",
  errorFetchingInvBySector: "Error Fetching Investment by Sector",
  errorFetchingSector: "Error Fetching Sector",
  errorOverAllAnalysis: "Error calculating overall analysis",
  errorTopGainers: "Error Fetching Top 5 Gainers",
  sectorRequired: "Sector is required",

  // Fixed Deposit
  fdCreated: "Fixed Deposit Added Successfully",
  fdDeleted: "Fixed Deposit Deleted successfully",
  fdUpdated: "Fixed Deposit Updated Successfully",
  fdView: "FD retrieved successfully",
  fdsView: "All Fixed Deposits Retrieved Successfully",
  fdAlreadyExists: "FD already exists",
  errorCreatingFD: "Error creating FD",
  errorDeletingFD: "Error deleting FD",
  errorFetchingFDs: "Error fetching FDs",
  errorFdAnalytics: "Error calculating FD Analytics",
  errorUpdatingFD: "Error updating FD",

  // User
  loginAdmin: "Admin Logged In Successfully",
  otpSuccess: "OTP Verified Successfully",
  passwordChanged: "Password changed successfully",
  resetPassword: "Password reset successfully",
  resetPasswordSend: "Password reset link sent to your mail",
  userCreated: "Registered Successfully",
  userDeleted: "Account deleted successfully",
  userExists: "User already exists",
  userLoggedIn: "Logged in successfully",
  userLoggedOut: "User logged out successfully",
  userNotFound: "User not found",
  userProfileUpdated: "User profile updated successfully",
  userUpdated: "Account updated successfully",
  userView: "User retrieved successfully",
  usersView: "Users retrieved successfully",
  errorLogin: "Error logging in user",
  errorRegisteringUser: "Error registering user",
  errorSendingPasswordResetEmail: "Error sending password reset email",
  errorUserUpdate: "Error updating user profile",
  fileTooLarge: "File size should be less than 1 MB",
  imageValidation: "Please upload a valid image file",
  incorrectOldPassword: "Invalid old password",
  otpExpired: "Expired OTP",
  otpInvalid: "Invalid OTP",
  passwordIncorrect: "Invalid password",
  passwordNotMatch: "Passwords do not match",
  unAuthUser: "Unauthorized User",

  // Gold Management
  analysisReportofFd: "Analysis Report of all the fixed deposits",
  analysisReportofGold: "Analysis Report of all the gold investments",
  errorCreatingGoldInfo: "Error registering Gold Information",
  errorDeletingGoldInfo: "Error deleting Gold Information",
  errorFetchingGoldInfo: "Gold Information not found",
  errorFetchingGoldMaster: "Error fetching Gold Master",
  errorGoldAnalytics: "Error calculating Gold analytics",
  errorGoldRecords: "Error fetching Gold Records",
  errorUpdatingGoldInfo: "Error updating Gold Information",
  goldExists: "Gold Info already exists",
  goldInfoDelete: "Gold info deleted successfully",
  goldInfoRegister: "Gold info registered successfully",
  goldInfoUpdate: "Gold info updated successfully",
  goldNotFound: "Gold records not found",
  goldNotFetch: "Gold Master data is not available",
  goldRecords: "Gold records fetched successfully",

  // Property
  propertyTypeCreated: "Property-Type registered successfully",
  propertyTypeDeleted: "Property-Type deleted successfully",
  propertyTypeUpdated: "Property-Type updated successfully",
  propertyTypeView: "Property-Types retrieved successfully",
  propertyTypeAlreadyExists: "Property Type already exists",
  propertyTypeNotFound: "Property type not found",
  errorFetchingPropertyType: "Error fetching property type",
  errorRegisterPropertyType: "Error registrating property type",
  errorUpdatingProperty: "Error updating Property Type",

  // Sub-Property
  subPropertyTypeAdded: "Sub Property Type Added Successfully",
  subPropertyTypeDeleted: "Sub Property Type Deleted Successfully",
  subPropertyTypeRetrieved: "Sub Property Type Retreived Successfully",
  subPropertyTypeUpdated: "Sub Property Type Updated Successfully",
  subPropertyTypesDeleted: "Sub Property Types Deleted Successfully",
  subPropertyTypeAlreadyExists: "Sub Property Type Already Exists",
  subPropertyTypeNotFound: "Sub Property Type Not Found",
  errorAddingSubPropertyType: "Error Adding Sub Property Type",
  errorDeletingSubPropType: "Error Deleting Sub Property Type",
  errorDeletingSubPropertyTypes: "Error Deleting Sub Property Types",
  errorFetchingSubPropTypes: "Error Fetching Sub Property Types",
  errorUpdatingSubPropType: "Error Updating Sub Property Type",

  // States
  stateCreated: "State registered successfully",
  stateDeleted: "State deleted successfully",
  stateUpdated: "State updated successfully",
  stateView: "State retrieved successfully",
  statesView: "States retrieved successfully",
  stateAlreadyExists: "State already exists",
  stateNotFound: "State not found",
  errorCreatingState: "Error creating state",
  errorDeletingState: "Error deleting state",
  errorFetchingState: "Error fetching states",
  errorFetchingStates: "Error fetching states",
  errorUpdatingState: "Error updating state",

  // Miscellaneous Errors
  deleteAuth: "You are unauthorized to delete this account",
  expiredToken: "Invalid or expired token",
  tokenNotFound: "Token not found in the database",
  tokenNotMatch: "Unauthorized. Token does not match user",
  tokenVerifyFail: "Token verification failed",
  updateUserError: "An error occurred while updating the profile",
};

module.exports = {
  statusCode,
  message,
};

module.exports = {
  statusCode,
  message,
};
