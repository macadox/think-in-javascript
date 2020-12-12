const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const { AppError } = require('./../handlers/errorHandler');

exports.getAllPosts = async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      data: posts,
    },
  });
};

exports.createPost = async (req, res, next) => {
  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newPost,
    },
  });
};

exports.getPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('There is no post with such ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: post,
    },
  });
};

exports.updatePost = async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!post) return next(new AppError('There is no post with such ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: post,
    },
  });
};

exports.deletePost = async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) return next(new AppError('There is no post with suchID!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
