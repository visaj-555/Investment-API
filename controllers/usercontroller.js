const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenModel = require("../models/tokenModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const PasswordResetTokenModel = require("../models/passwordResetTokenModel");
const { statusCode, message } = require("../utils/api.response");
const { response } = require("express");

// Registering User
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phoneNo, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.userAlreadyExists });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      firstName,
      lastName,
      phoneNo,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(statusCode.CREATED).json({
      message: message.userCreated,
      data: { ...savedUser.toObject(), password: undefined },
    });
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: message.errorRegisteringUser, error });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.userNotFound });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.passwordIncorrect });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1d",
    });

    // Save the token in the database with the userId
    const tokenDoc = new TokenModel({ token, userId: user._id });
    await tokenDoc.save();

    res.status(statusCode.OK).json({
      message: message.userLoggedIn,
      data: {
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNo: user.phoneNo,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: message.errorLogin });
  }
};

// Read all the Users Information
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.status(statusCode.OK).json({
      message: message.usersView,
      data: users,
    });
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: message.errorFetchingUsers, error });
  }
};

// Read User Information by Id
const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id, { password: 0 });
    if (!user) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: message.userNotFound });
    }
    res.status(statusCode.OK).json({
      message: message.userView,
      data: user,
    });
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: message.errorFetchingUser, error });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.imageValidation });
    }

    if (!req.file) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.imageValidation });
    }

    if (req.fileSizeLimitError) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.fileTooLarge });
    }

    const { firstName, lastName, phoneNo, email } = req.body;
    const profileImage = req.file.path; // Path of uploaded image

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: message.userNotFound });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo || user.phoneNo;
    user.email = email || user.email;
    user.profileImage = profileImage;

    await user.save();

    // Respond with success message
    res.status(statusCode.OK).json({
      message: message.userProfileUpdated,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNo: user.phoneNo,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: message.updateUserError });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: message.userNotFound });
    }
    res.status(statusCode.OK).json({ message: message.userDeleted });
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: message.deleteUserError, error: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: message.userNotFound });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.incorrectOldPassword });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ message: message.passwordNotMatch });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    await TokenModel.deleteMany({ userId: userId });

    res.status(statusCode.OK).json({ message: message.passwordChanged });
  } catch (err) {
    console.error(err);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: message.passwordChangeError });
  }
};

// Generate OTP function

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); 
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const { email } = req.body;
    console.log("Email received:", email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(statusCode.BAD_REQUEST).json({ message: "Invalid email format" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json({ message: message.userNotFound });
    }

    // Generate OTP
    const otp = generateOtp();

    const passwordResetToken = new PasswordResetTokenModel({
      token: otp,
      userId: user._id,
      expires: Date.now() + 3600000, // 1 hour expiration
    });

    // Save the OTP to the database
    await passwordResetToken.save();

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `<p>Here is your OTP: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(statusCode.OK).json({ message: message.resetPasswordSend });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: message.errorSendingPasswordResetEmail });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;

    // Validate that newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res.status(statusCode.BAD_REQUEST).json({ message: message.passwordNotMatch });
    }

    const resetToken = await PasswordResetTokenModel.findOne({ token: otp });

    if (!resetToken) {
      console.error('Invalid OTP');
      return res.status(statusCode.BAD_REQUEST).json({ message: message.otpInvalid });
    }

    if (resetToken.expires < Date.now()) {
      console.error('Expired OTP');
      return res.status(statusCode.BAD_REQUEST).json({ message: message.expiredToken });
    }

    const userId = resetToken.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error('User not found');
      return res.status(statusCode.BAD_REQUEST).json({ message: message.userNotFound });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Delete the reset token from the database using deleteOne
    await PasswordResetTokenModel.deleteOne({ _id: resetToken._id });

    res.status(statusCode.OK).json({ message: message.resetPasswordSuccess });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: message.resetPasswordError });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
