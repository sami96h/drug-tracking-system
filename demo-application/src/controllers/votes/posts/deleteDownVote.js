const { deletePostDownVoteQuery } = require('../../../database/queries');

const deletePostDownVote = (req, res) => {
    const {post_id,userId} = req.body;

    deletePostDownVoteQuery({ post_id, userId })
        .then(() => {
            res.json({
                msg: "success",
            })
        })
        .catch((err) => {
            res.status(500).json({ msg: err.detail });
        });

};


module.exports = deletePostDownVote;