// URL Regex
// Modified from this: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const urlRegex =
  /^(?<PROTOCOL>https?:\/\/)?(?:www\.)?(?<URL>[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))$/;

module.exports = urlRegex;
