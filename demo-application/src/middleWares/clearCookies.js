const clearCookies = (req, res, next) => {
  res.clearCookie('logged');
  next();
};

module.exports = clearCookies;
