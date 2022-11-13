const { sign } = require('jsonwebtoken');

const setToken = (req, res, next) => {
  const id = req.body.userId;
  const secret = process.env.SECRET;
  const cookie = sign({ userId: id }, secret);
  res.cookie('logged', cookie, { httpOnly: false, secure: true });
  next();
};

module.exports = setToken;
