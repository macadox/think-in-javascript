const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Config = require('./../models/Config');
const Post = require('./../models/Post');
const Comment = require('./../models/Comment');
const User = require('./../models/User');

dotenv.config({ path: './config.env' });

mongoose
  .connect(`${process.env.DATABASE}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to DB`))
  .catch((err) => console.log(err));

const config = fs.readFileSync(`${__dirname}/config.json`, {
  encoding: 'utf-8',
});
const posts = fs.readFileSync(`${__dirname}/posts.json`, { encoding: 'utf-8' });

const importData = async () => {
  try {
    await Config.create(JSON.parse(config));
    await Post.create(JSON.parse(posts));
    console.log(
      `Data successfully loaded! At ${new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).format(Date.now())}`
    );
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Config.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await User.deleteMany({});
    console.log(
      `Data successfully deleted! At ${new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).format(Date.now())}`
    );
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] == '--delete') {
  deleteData();
} else if (process.argv[2] == '--import') {
  importData();
} else {
  console.log('command not known');
  process.exit();
}
