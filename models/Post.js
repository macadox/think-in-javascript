const mongoose = require('mongoose');
const slug = require('slugs');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'A post has to have a title!',
    trim: true,
  },
  content: {
    type: String,
    required: 'A post has to have some content!',
    trim: true,
  },
  photo: String,
  slug: String,
  created: {
    type: Date,
    default: Date.now,
  },
  author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'A post has to have an author!'
  },
  tags: [String],
  category: String,
  // comments: [ObjectId]
});

postSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slug(this.title);

  const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const postsWithSlug = await this.constructor.find({ slug: slugRegex });

  if (postsWithSlug.length > 0) {
    this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
