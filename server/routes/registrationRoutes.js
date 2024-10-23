const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const registrationController = require('../controllers/registrationController');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route for user registration
router.post('/sendOTP', registrationController.sendOTP);

router.post('/registration', upload.single('file'), registrationController.registerUser);

// Route for user Login
router.post('/login', registrationController.loginUser);
router.post('/otpSend', registrationController.otpSend);
router.post('/resetPassword', registrationController.resetPassword);

router.get('/logout', registrationController.logoutUser);
router.get('/userInfo', registrationController.userSession);

router.post('/updateProfile', registrationController.updateProfile);

router.get('/getFollowers', registrationController.getFollowers);
router.get('/getFollowing', registrationController.getFollowing);

router.get('/getUsers', registrationController.getUsers);
router.get('/getFollow', registrationController.getFollow);


router.post('/followUser', registrationController.followUser);
router.post('/unfollowUser', registrationController.unfollowUser);

router.delete('/users/:id', registrationController.deleteUser)

router.get('/check-auth', registrationController.auth);

router.get('/searchUser', registrationController.searchUser);





module.exports = router;
