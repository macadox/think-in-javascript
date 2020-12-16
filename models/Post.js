const mongoose = require('mongoose');
const slug = require('slugs');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: 'A post has to have a title!',
      trim: true,
    },
    description: {
      type: String,
      required: 'A post hast to have some description',
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
      required: 'A post has to have an author!',
    },
    tags: [String],
    category: String,
    // comments: [ObjectId]
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

postSchema.index({
  created: -1,
});

postSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
});

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
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

postSchema.statics.getTagsList = function () {
  return this.aggregate([
    {
      $unwind: '$tags',
    },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1, _id: 1 },
    },
  ]);
};

postSchema.statics.getCategoriesList = function () {
  return this.aggregate([
    {
      $unwind: '$category',
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1, _id: 1 },
    },
  ]);
};

module.exports = mongoose.model('Post', postSchema);
