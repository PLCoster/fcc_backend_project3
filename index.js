// .env file can hold PORT variable if desired
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
  checkValidURL,
  generateShortURL,
  saveShortURL,
} = require('./middleware');

const app = express();

// Log incoming requests in development:
if (process.env.RUN_MODE === 'development') {
  app.use((req, res, next) => {
    console.log(
      `${req.method} ${req.path}; IP=${req.ip}; https?=${req.secure}`,
    );
    next();
  });
}

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
app.use(cors());

// Parse url encoded bodies:
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from 'public' folder
// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(`${__dirname}/public`));

// Send index.html on requests to root
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// POST route to submit URLs to be shortened
// Returns json with original and shortened url path if successful
app.post(
  '/api/shorturl',
  checkValidURL,
  generateShortURL,
  saveShortURL,
  (req, res) => {
    const { original_url, short_url, short_link } = res.data.shortURLDocument;
    return res.json({ original_url, short_url, short_link });
  },
);

// 404 page not found:
app.get('*', function (req, res) {
  // Redirect to index
  res.redirect('/');
});

// Internal Error Handler:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server error: See Server Logs');
});

// Have server listen on PORT or default to 3000
// http://localhost:3000/
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
