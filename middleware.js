const dns = require('dns').promises;

const urlRegex = require('./helpers/urlRegex');
const generatePathStr = require('./helpers/generatePathStr');
const ShortURL = require('./models/shortURL');

const SITE_URL =
  process.env.RUN_MODE === 'development'
    ? `http://localhost:${process.env.PORT || 3000}`
    : `https://fcc-backend-project3.plcoster.repl.co/`;

const middleware = {};

// Takes 'url' parameter from req.body and determines if url is valid:
middleware.checkValidURL = (req, res, next) => {
  const urlStr = req.body.url;

  // Test given URL string against regex
  const urlMatch = urlStr.match(urlRegex);
  if (!urlMatch) {
    return res.json({ error: 'invalid url', url: urlStr });
  }

  // If no PROTOCOL (e.g. http://), then add one, get hostname via URL:
  const { PROTOCOL: protocol, URL: url } = urlMatch.groups;
  const hostname = new URL(`${protocol || 'https://'}${url}`).hostname;

  // Check hostname is valid / exists via dns
  dns
    .resolve(hostname)
    .then(() => {
      //If we get here url is valid, go to next middleware:
      next();
    })
    .catch((err) => {
      console.error('ERROR when trying to resolve given address: ', err);
      return res.json({ error: 'invalid url', url: urlStr });
    });
};

// Generate a random, unique short URL string
// Add it to res.data.short_url
middleware.generateShortURL = async (req, res, next) => {
  res.data = res.data || {};
  let tries = 0;

  // Try up to 5 times to generate a unique, unused short url
  while (tries < 5) {
    const short_url = generatePathStr();
    try {
      const exists = await ShortURL.findOne({ short_url });
      if (!exists) {
        res.data.short_url = short_url;
        return next();
      }
    } catch (err) {
      console.error(
        'Error when checking if short_url exists in database: ',
        err,
      );
    }
    tries += 1;
  }

  // If we get here, generating the unique short URL has failed:
  return res.json({ error: 'Could not generate a unique short URL' });
};

// Given the unique shortURL on res.data.short_url, create a new ShortURL document
// Add the ShortURL document to res.data.shortURLDocument
middleware.saveShortURL = (req, res, next) => {
  const original_url = req.body.url;
  const short_url = res.data.short_url;
  const short_link = SITE_URL + '/' + short_url;
  ShortURL.create({ original_url, short_url, short_link })
    .then((document) => {
      res.data.shortURLDocument = document;
      next();
    })
    .catch((err) => {
      console.error('Error when trying to create ShortURL in DB: ', err);
      return res.json({ error: 'Could not save ShortURL in DB' });
    });
};

module.exports = middleware;
