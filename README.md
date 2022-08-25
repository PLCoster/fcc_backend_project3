# Free Code Camp: Backend Project 3 - URL Shortener Microservice

## URL Shortener Microservice

The aim of this project was to build a small web app with functionality similar to: https://url-shortener-microservice.freecodecamp.rocks

The project was built using the following technologies:

- **HTML**
- **JavaScript** with **[Node.js](https://nodejs.org/en/) / [NPM](https://www.npmjs.com/)** for package management.
- **[Express](https://expressjs.com/)** web framework to build the web API.
- **[mongoose](https://mongoosejs.com/)** for MongoDB object modeling, interacting with a **[MongoDB Atlas](https://www.mongodb.com/atlas/database)** database.
- **[Bootstrap](https://getbootstrap.com/)** for styling with some custom **CSS**.
- **[FontAwesome](https://fontawesome.com/)** for icons.
- **[nodemon](https://nodemon.io/)** for automatic restarting of server during development.

### Project Requirements:

- **User Story #1:** You can POST a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties. Here's an example: `{ original_url : 'https://freeCodeCamp.org', short_url : 1}`

- **User Story #2:** When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL.

- **User Story #3:** If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain `{ error: 'invalid url' }`

### Project Writeup:

The third Free Code Camp: Back End Development Project is a URL shortener microservice. Users can:

- Submit a URL to be shortened using the form on the app home page, or by sending a POST request to `/api/shorturl` with a urlencoded body containing the field 'url' containing a valid URL.

- Be redirected to the original URL by sending a GET request to `/api/shorturl/<SHORT_URL>` where `SHORT_URL` is the `short_url` string returned via JSON when a URL to be shortened is submitted.

Shortened URL records are stored in a MongoDB database, and expire after 24hrs.

### Project Files:

- `index.js` - the main entry point of the application, an express web server handling the routes defined in the specification.

- `public/` - contains static files for the web app (stylesheet, logo, favicons etc), served by express using `express.static()`.

- `views/` - contains the single html page for the web app, `index.html`, which is served by express on `GET` requests to `/`.

- `middleware/` - contains express middleware functions used by the two major routes of the express server.

- `models/` - contains `mongoose` schema and models for the database interactions of the app.

- `helpers/` - contains two small helper files used by some of the middleware functions.

### Usage:

Requires Node.js / NPM in order to install required packages. After downloading the repo, install required dependencies with:

`npm install`

To run the app locally, a valid MongoDB database URI is required to be entered as an environmental variable (MONGO_URI), which can be done via a `.env` file (see sample.env). One possible MongoDB service is **[MongoDB Atlas](https://www.mongodb.com/atlas/database)**.

A development mode (with auto server restart on file save), can be started with:

`npm run dev`

The application can then be viewed at `http://localhost:3000/` in the browser.

To start the server without auto-restart on file save:

`npm start`

# URL Shortener Microservice BoilerPlate

The initial boilerplate for this app can be found at https://url-shortener-microservice.freecodecamp.rocks/

Instructions for building the project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice
