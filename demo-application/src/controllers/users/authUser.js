const { authUserQuery } = require('../../database/queries');

const authUser = (req, res) => {
  const { username, password } = req.body;

  authUserQuery(username, password).then((data) => {
    if (data.rows.length) {
      const { id } = data.rows[0];
      res.json({
        endPoint: `users/${id}`,

      });
    } else {
      res.json({
        err: 'User not found!',
      });
    }
  }).catch(() => {
    console.log('query error!!');
  });
};

module.exports = authUser;
