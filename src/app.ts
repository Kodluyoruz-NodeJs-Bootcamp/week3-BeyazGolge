import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import apiRoute from './routes/apiRoute';
import User from './models/user';
const nodeEnv = 'NODE_ENV';
import { get } from './config/config';
const config = get(
  process.env[nodeEnv] === 'production' ? 'production' : 'default'
);

// const pageRoute = require("./routes/pageRoute");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Database connection

try {
  mongoose.connect(config.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
} catch (error) {
  throw error;
}
// If user is found by the token send the user data to front end
app.get('/', async (req, res) => {
  const user = req.cookies.auth
    ? await User.findOne({ token: req.cookies.auth })
    : null;

  res.status(200).render('index', {
    userIN: !!user,
  });
});

app.use('/api', apiRoute);

app.listen(process.env.PORT || 3000, () => {
  // tslint:disable-next-line:no-console
  console.log('App is live');
});
