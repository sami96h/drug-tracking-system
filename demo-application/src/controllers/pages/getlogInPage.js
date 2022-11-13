const path = require('path');

const getlogInPage = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', '..', '..', 'public', 'signIn.html'));
};
module.exports = getlogInPage;
