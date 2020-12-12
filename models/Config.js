const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
  _immutable: {
    type: Boolean,
    required: true,
    default: true,
    unique: true,
    immutable: true,
  },
  siteOffline: Boolean,
  email: {
    smptHostname: String,
    smtpPort: Number,
    smtpUsername: String,
    smtpPassword: String,
  },
  passwordResetExpiry: Number,
  categories: [String],
  tags: [String],
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;
