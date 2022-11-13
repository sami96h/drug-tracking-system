const bcrypt = require('bcrypt');

const comparePasswords = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

module.exports = comparePasswords;
