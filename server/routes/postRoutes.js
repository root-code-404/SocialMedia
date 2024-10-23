const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PostController = require('../controllers/PostController');

// WebSocket setup function
const setupWebSocket = (io) => {
  PostController.setupWebSocket(io);
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer instance
const upload = multer({ storage });

// Routes
router.post('/post', upload.single('file'), PostController.uploadPost);
router.get('/getPost', PostController.getPost);
router.delete('/postDelete/:id', PostController.deletePost);
router.put('/postEdit/:id', PostController.editPost);

router.post('/likePost/:postId', PostController.likePost);
router.get('/getLikedPosts', PostController.getLikedPosts);
router.get('/getLikedUsers/:post_id', PostController.getLikedUsers);

router.get('/getPostHome', PostController.getPostHome);

router.post('/commentPost/:post_id', PostController.commentPost);
router.get('/comments/:post_id', PostController.getComments);

router.get('/getUserProfile/:userId', PostController.getUserProfile);
router.get('/getUserPost/:userId', PostController.getUserPosts);
router.get('/getUserDetailsAndPosts/:userId', PostController.getUserDetailsAndPosts);

router.get('/getPostDetails/:postId', PostController.getPostDetails);


// Export the router
module.exports = { router, setupWebSocket };
