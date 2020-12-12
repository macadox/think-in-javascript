const express = require('express');
const postController = require('./../controllers/postController');
const { tryCatch } = require('./../handlers/errorHandler');

const router = express.Router();

router
  .route('/')
  .get(tryCatch(postController.getAllPosts))
  .post(tryCatch(postController.createPost));

router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
