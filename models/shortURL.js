// Set up mongoose connection to MONGO DB:
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error');
  });

// https://mongoosejs.com/docs/guide.html
// https://mongoosejs.com/docs/api.html
const shortURLSchema = new mongoose.Schema({
  original_url: String,
  short_url: { type: String, unique: true }, // Must be unique!
  short_link: { type: String, unique: true },
  expireAt: { type: Date, expires: 86400, default: Date.now() }, // Auto Expire document after 1 day
});

const shortURL = mongoose.model('shortURL', shortURLSchema);

module.exports = shortURL;
