// 62 chars
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Generates a random 6-character string
// 62^6 possibilities
const generatePathStr = () => {
  const charArr = [];
  for (let i = 0; i < 6; i += 1) {
    const num = Math.floor(Math.random() * chars.length);
    charArr.push(chars[num]);
  }
  return charArr.join('');
};

module.exports = generatePathStr;
