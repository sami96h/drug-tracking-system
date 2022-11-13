const { verify } = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  if ('logged' in req.cookies) {
    const cookie = req.cookies.logged;
    verify(cookie, process.env.SECRET, (err, data) => {
      if (err) {
        next(err);
      } else {
        const { userId } = data;
        req.body.userId = userId;
        next();
      }
    });
  } else {
    res.redirect('/signUp');
  }
};

module.exports = checkToken;
