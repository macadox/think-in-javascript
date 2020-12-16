const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

exports.addComment = async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });

  req.body.author = req.user._id;
  req.body.post = post._id;

  await Comment.create(req.body);

  req.flash('success', 'Comment has been added!');
  res.redirect('back');
};
