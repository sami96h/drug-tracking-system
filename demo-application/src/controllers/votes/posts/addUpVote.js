const { addPostUpVoteQuery, deletePostDownVoteQuery } = require('../../../database/queries');

const addPostUpVote = (req, res, next) => {
  const {post_id,userId} = req.body;

  deletePostDownVoteQuery({ post_id, userId })
    .then(
      addPostUpVoteQuery({ post_id, userId })
        .then(() => {
          res.json({
            msg: 'success',
          });
        })
        .catch((err) => {
          res.status(500).json({ msg: err.detail });
        }),
    )
    .catch((err) => {
      res.json({
        msg: err.detail,
      });
    });
};

module.exports = addPostUpVote;
