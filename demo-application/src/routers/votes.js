const express = require('express');

const router = express.Router();
const {
  addPostUpVote, deletePostUpVote, addPostdownVote, deletePostDownVote,
} = require('../controllers');

/* UP VOTE */
router.post('/upVote', addPostUpVote);
router.delete('/upVote', deletePostUpVote);

/* DOWN VOTE */

router.post('/downVote', addPostdownVote);
router.delete('/downVote', deletePostDownVote);

module.exports = router;
