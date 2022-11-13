const { getPostsQuery } = require('../../database/queries');

const getPosts = (req, res,next) => {
  getPostsQuery()
    .then((posts) => {
      res.json(posts.rows);
    })
    .catch((err) => {
      next(err)
    });
};

module.exports = getPosts;
