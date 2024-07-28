//UserModel.js

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNo: {
      type: Number,
      unique: true
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    }
  },
  { timestamps: true }
); 

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
