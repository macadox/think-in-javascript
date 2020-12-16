const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'A comment must have an author!',
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: 'One can only comment on posts!',
  },
  comment: {
    type: String,
    required: 'A comment must have some content!',
  },
});

function autopopulate(next) {
  this.populate('author');

  next();
}

commentSchema.pre(/^find/, autopopulate);


module.exports = mongoose.model('Comment', commentSchema);
