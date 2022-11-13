const express = require('express');

const router = express.Router();
const { getPosts, addPost, getAuthPosts } = require('../controllers');

router.get('/authPosts', getAuthPosts);
router.get('/posts', getPosts);
router.post('/posts/:userId', addPost);

module.exports = router;
