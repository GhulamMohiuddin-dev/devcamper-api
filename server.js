const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const colors = require('colors');
const errorHandler = require('./middlewares/errors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const bootCamps = require('./routes/bootcamps');
const Course = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/users');
const review = require('./routes/reviews');

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

//Body parser
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(fileupload());

app.use(mongoSanitize());

app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(hpp());

app.use(cors());

app.use(express.static(path.join(__dirname, '/public')));

// Mount Routerss
app.use('/api/v1/bootcamp', bootCamps);
app.use('/api/v1/course', Course);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/reviews', review);

//errorHandler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err}`.red.bold);
  server.close(() => process.exit(1));
});
