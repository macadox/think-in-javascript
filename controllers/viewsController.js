const mongoose = require('mongoose');
const { AppError } = require('../handlers/errorHandler');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const Config = mongoose.model('Config');

exports.getHomepage = async (req, res, next) => {
  const posts = await Post.find().sort('-created').populate('author comments');

  res.render('posts', {
    title: 'Home',
    posts,
  });
};

exports.getContact = (req, res, next) => {
    res.render('contact', {title: 'Contact Me :)'})
}


exports.getPostBySlug = async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    'author comments'
  );

  res.render('post', {
    title: post.title,
    post,
  });
};

exports.getPostsByTag = async (req, res, next) => {
  const tag = req.params.tag;

  if (tag && !res.locals.config.tags.find((t) => t.slug === tag)) {
    return next(new AppError(`Tag with name ${tag} does not exist!`, 404));
  }
  const tagName = tag
    ? res.locals.config.tags.find((t) => t.slug === tag).name
    : '';
  const tagQuery = tagName || { $exists: true };

  const tagsPromise = Post.getTagsList();
  const postsPromise = Post.find({ tags: tagQuery })
    .sort('-created')
    .populate('author comments');

  let [posts, tags] = await Promise.all([postsPromise, tagsPromise]);

  tags = tags.map((tag) => {
    const tagFromConfig = res.locals.config.tags.find(
      (t) => t.name === tag._id
    );
    return {
      _id: tagFromConfig._id,
      name: tagFromConfig.name,
      slug: tagFromConfig.slug,
      count: tag.count,
    };
  });

  res.render('tags', {
    title: tagName || 'All Tags',
    posts,
    tags,
  });
};

exports.getCategories = async (req, res, next) => {
  let categories = await Post.getCategoriesList();

  categories = categories.map((cat) => {
    const catFromConfig = res.locals.config.categories.find(
      (c) => c.name === cat._id
    );
    return {
      _id: cat._id,
      name: catFromConfig.name,
      slug: catFromConfig.slug,
      count: cat.count,
    };
  });

  res.render('categories', {
    title: 'All Categories',
    categories,
  });
};

exports.getPostsByCategory = async (req, res, next) => {
  const cat = req.params.cat;

  if (cat && !res.locals.config.categories.find((c) => c.slug === cat)) {
    return next(new AppError(`Category with name ${cat} does not exist!`, 404));
  }

  const catName = cat
    ? res.locals.config.categories.find((c) => c.slug === cat).name
    : '';

  const catsPromise = Post.getCategoriesList();
  const postsPromise = Post.find({ category: catName })
    .sort('-created')
    .populate('author comments');

  let [posts, categories] = await Promise.all([postsPromise, catsPromise]);

  categories = categories.map((cat) => {
    const catFromConfig = res.locals.config.categories.find(
      (c) => c.name === cat._id
    );
    return {
      _id: cat._id,
      name: catFromConfig.name,
      slug: catFromConfig.slug,
      count: cat.count,
    };
  });

  res.render('category', {
    title: catName,
    posts,
    categories,
  });
};

exports.getRecent = async (req, res, next) => {
  const recentPostsPromise = Post.find()
    .sort('-created')
    .sort('-created')
    .limit(3);
  const recentCommentsPromise = Comment.find()
    .sort('-created')
    .limit(5)
    .populate('post');
  const configPromise = Config.findOne();
  const [recentPosts, recentComments, config] = await Promise.all([
    recentPostsPromise,
    recentCommentsPromise,
    configPromise,
  ]);

  res.locals.recentPosts = recentPosts || [];
  res.locals.recentComments = recentComments || [];
  res.locals.config = config;
  next();
};

