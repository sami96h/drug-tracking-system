const path = require('path');

const getSignUpPage = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', '..', '..', 'public', 'signUp.html'));
};
module.exports = getSignUpPage;
