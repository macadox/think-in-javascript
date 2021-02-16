const crypto = require('crypto');
const mongoose = require('mongoose');

const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const Config = require('./Config');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: 'A user needs to have an email',
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email needs to have an email format',
    },
  },
  name: {
    type: String,
    required: 'A user needs to have a name',
    trim: true,
  },
  permissionPower: {
    type: Number,
    default: 10,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  avatar: String,
});

userSchema.methods.generatePasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const config = await Config.findOne();
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + config.passwordResetExpiry * 60 * 1000;
  return resetToken;
};

// userSchema.plugin(mongodbErrorHandler);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
