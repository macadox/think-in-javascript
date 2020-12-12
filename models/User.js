const mongoose = require('mongoose');

const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  email: {
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
    default: 10
  }
});

// userSchema.plugin(mongodbErrorHandler);
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
