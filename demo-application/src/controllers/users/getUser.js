const path = require('path');

const getUser = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', '..', '..', 'public', 'posts.html'));
};

module.exports = getUser;
