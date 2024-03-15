const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This validator only works on save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  tokenVersion: {
    type: Number,
    required: true,
    default: 0, // Or any default value you prefer
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password is actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Increment token version when password changes
  this.tokenVersion += 1;

  // Delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

// Method to check if the password provided by the user during login matches the stored hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if the user's password was changed after a given timestamp (e.g., JWT timestamp)
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    return this.passwordChangedAt.getTime() / 1000 > JWTTimestamp;
  }
  return false; // Default to false if passwordChangedAt is not set
};

const User = mongoose.model('User', userSchema);
module.exports = User;
