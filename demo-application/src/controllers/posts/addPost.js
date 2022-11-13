const { addPostQuery } = require('../../database/queries');

const addPost = (req, res) => {
  const { textContent ,userId} = req.body;
  addPostQuery({ userId, textContent })
    .then(() => {
      res.redirect(`/`);
    })
    .catch((err) => {
      res.status(500).json({ msg: 'server error' });
    });
};





module.exports = addPost;
