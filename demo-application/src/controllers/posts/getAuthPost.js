const { getAuthPostsQuery } = require('../../database/queries');

const getAuthPosts = (req, res,next) => {
  const { userId } = req.body;
  getAuthPostsQuery(userId)
    .then((posts) => {

      res.json(posts.rows);
    })
    .catch((err) => {
      next(err)
    });
};

module.exports = getAuthPosts;
