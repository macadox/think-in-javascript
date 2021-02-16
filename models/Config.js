const mongoose = require('mongoose');
const slug = require('slugs');

const configSchema = mongoose.Schema({
  _immutable: {
    type: Boolean,
    required: true,
    default: true,
    unique: true,
  },
  siteOffline: Boolean,
  email: {
    smptHostname: String,
    smtpPort: Number,
    smtpUsername: String,
    smtpPassword: String,
    emailFrom: String
  },
  passwordResetExpiry: Number,
  categories: [
    {
      name: String,
      slug: String,
    },
  ],
  tags: [
    {
      name: String,
      slug: String,
    },
  ],
});

configSchema.pre('save', async function (next) {
  if (!this.isModified('categories')) return next();

  this.categories.forEach((category) => {
    category.slug = slug(category.name);
  });

  next();
});

configSchema.pre('save', async function (next) {
  if (!this.isModified('tags')) return next();

  this.tags.forEach((tag) => {
    tag.slug = slug(tag.name);
  });

  next();
});

module.exports = mongoose.model('Config', configSchema);
