// .env file can hold PORT variable if desired
require('dotenv').config();

const dns = require('dns').promises;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const urlRegex = require('./helpers/urlRegex');
const generatePathStr = require('./helpers/generatePathStr');
const shortURL = require('./models/shortURL');

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

// POST route to submit URLs to be shortened:
app.post('/api/shorturl', (req, res) => {
  const urlStr = req.body.url;

  // Test given URL string against regex
  const urlMatch = urlStr.match(urlRegex);
  if (!urlMatch) {
    return res.json({ error: 'invalid url', url: urlStr });
  }

  // If no PROTOCOL, then add one, get hostname from URL object:
  const { PROTOCOL: protocol, URL: url } = urlMatch.groups;
  const hostname = new URL(`${protocol || 'https://'}${url}`).hostname;

  // Check hostname is valid / exists via dns
  dns
    .resolve(hostname)
    .then(async () => {
      // URL is legitimate, add shortened URL to DB and return
      let tries = 0;
      let short_url;

      // Try up to 5 times to generate a unique, unused short url
      while (tries < 5) {
        short_url = generatePathStr();

        const exists = await shortURL.findOne({ short_url });
        if (!exists) {
          return Promise.resolve(short_url);
        }
      }

      // Something has gone wrong generating a unique short url
      return Promise.reject('Could not find a unique, unused short url');
    })
    // Otherwise create a MongoDB Document and return info as JSON to user
    .then((short_url) => shortURL.create({ original_url: urlStr, short_url }))
    .then(({ original_url, short_url }) =>
      res.json({ original_url, short_url }),
    )
    .catch((err) => {
      console.error('ERROR when trying to resolve given address: ', err);
      return res.json({ error: 'invalid url', url: urlStr });
    });
});

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
