const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

  console.log(process.env.NODE_ENV);
  
  // Import mongoose models
  require('./models/Post');
  require('./models/Config');
  require('./models/User');
  
  require('./handlers/passport.js');

const app = require('./app');
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`);
});
