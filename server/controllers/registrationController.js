const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const nodemailerUtils = require('./nodemailerUtils');
const VerificationModel = require('../models/VerificationModel');
const PostModel = require('../models/PostModel');



const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is null or empty
    if (!email) {
      return res.json({ success: false, message: 'Please enter a valid email address' });
    }

    // Check if the email exists in the UserModel
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.json({ success: false, message: 'User with this email already exists' });
    }

    // Generate new OTP
    const verificationCode = nodemailerUtils.generateVerificationCode();

    // Save the verification code (overwrite existing if any)
    const result = await VerificationModel.findOneAndUpdate(
      { email },
      { code: verificationCode },
      { upsert: true, new: true } // Use { new: true } to return the updated document
    );

    // Send OTP to the email
    nodemailerUtils.sendVerificationEmail(email, verificationCode);

    if (result) {
      return res.json({ success: true, message: 'OTP sent successfully' });
    } else {
      return res.json({ success: false, message: 'Error sending OTP' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({ success: false, message: 'Error sending OTP' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, number, email, password, otp } = req.body;

    const isOtpValid = await VerificationModel.findOne({ email, code: otp });

    if (!isOtpValid) {
      return res.json({ success: false, message: 'Invalid OTP. Please check your email for the correct OTP.' });
    }

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt)

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { number }, { name }],
    });

    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newUser = new UserModel({
      name,
      number,
      email,
      password: pass,
      filePath,
    });

    await newUser.save();

    // Remove the used OTP from the VerificationModel
    await VerificationModel.findOneAndDelete({ email });

    return res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error:', error);
    return res.json({ success: false, message: 'Error registering user' });
  }
};

const otpSend = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is null or empty
    if (!email) {
      return res.json({ success: false, message: 'Please enter a valid email address' });
    }

    // Check if the email exists in the UserModel
    const userExists = await UserModel.findOne({ email });

    // If the user doesn't exist, return an error
    if (!userExists) {
      return res.json({ success: false, message: 'User with this email does not exist' });
    }

    // Generate new OTP
    const verificationCode = nodemailerUtils.generateVerificationCode();

    // Save the verification code (overwrite existing if any)
    const result = await VerificationModel.findOneAndUpdate(
      { email },
      { code: verificationCode },
      { upsert: true, new: true } // Use { new: true } to return the updated document
    );

    // Send OTP to the email
    nodemailerUtils.sendVerificationEmail(email, verificationCode);

    if (result) {
      return res.json({ success: true, message: 'OTP sent successfully' });
    } else {
      return res.json({ success: false, message: 'Error sending OTP' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({ success: false, message: 'Error sending OTP' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    // Check if the verification code is valid
    const isVerificationCodeValid = await VerificationModel.findOne({ email, code: verificationCode });

    if (!isVerificationCodeValid) {
      return res.json({ success: false, message: 'Invalid verification code. Please check your email for the correct code.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the UserModel
    const userUpdate = await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!userUpdate) {
      return res.json({ success: false, message: 'Error updating password.' });
    }

    // Remove the used verification code from the VerificationModel
    await VerificationModel.findOneAndDelete({ email, code: verificationCode });

    return res.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error:', error);
    return res.json({ success: false, message: 'Error resetting password.' });
  }
};



//for login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by name 
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    // Store user information in session
    req.session.user = user

    // Check usertype and send different responses
    switch (user.usertype) {
      case 1:
        return res.json({ success: true, usertype: user.usertype, message: 'Admin login successful' });
      case 2:
        return res.json({ success: true, usertype: user.usertype, message: 'user login successful' });
      case 3:
        return res.json({ success: true, usertype: user.usertype, message: 'company login successful' });
      default:
        return res.json({ success: false, message: 'Invalid usertype' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


//for logout
const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: 'Error logging out' });
    }
    return res.json({ success: true, message: 'Logout successful' });
  });
};

//for get sesssion 
const userSession = async (req, res) => {
  const users = req.session.user;
  const user = await UserModel.findOne({ email: users.email });
  res.json(user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, number, bio } = req.body;
    const loggedInUserEmail = req.session.user.email;

    const loggedInUser = await UserModel.findOne({ email: loggedInUserEmail });

    if (!loggedInUser) {
      return res.json({ success: false, message: 'Invalid user email' });
    }

    loggedInUser.name = name;
    loggedInUser.number = number;
    loggedInUser.bio = bio;

    await loggedInUser.save();

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getFollowers = async (req, res) => {
  try {
    // Check if user is in session
    if (!req.session || !req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUserId = req.session.user._id;

    const loggedInUser = await UserModel.findById(loggedInUserId);

    // Get the list of followers' email addresses
    const followers = loggedInUser.followers;

    // Fetch followers' details 
    const followerDetails = await UserModel.find({ email: { $in: followers } });

    return res.json(followerDetails);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getFollowing = async (req, res) => {
  try {
    // Check if user is in session
    if (!req.session || !req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUserId = req.session.user._id;

    const loggedInUser = await UserModel.findById(loggedInUserId);

    // Get the list of followers' email addresses
    const following = loggedInUser.following;

    // Fetch followers' details 
    const followingDetails = await UserModel.find({ email: { $in: following } });

    return res.json(followingDetails);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    // Check if user is in session
    if (!req.session || !req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUserId = req.session.user._id;

    const users = await UserModel.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        { usertype: 2 } // Add this condition for usertype
      ]
    });
    // Fetch logged-in user's following list
    const loggedInUser = await UserModel.findById(loggedInUserId);
    const followingList = loggedInUser.following;

    // Add a property "isFollowing" to each user
    const usersWithFollowStatus = users.map(user => {
      return {
        ...user.toObject(),
        isFollowing: followingList.includes(user.email.toString())
      };
    });

    return res.json(usersWithFollowStatus);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getFollow = async (req, res) => {
  try {
    // Check if user is in session
    if (!req.session || !req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUserId = req.session.user._id;
    const loggedInUser = await UserModel.findById(loggedInUserId);

    const users = await UserModel.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        { usertype: 2 }, // Add this condition for usertype
        { email: { $nin: loggedInUser.following } } // Exclude users in following list
      ]
    });
    // Fetch logged-in user's following list
    const followingList = loggedInUser.following;

    // Add a property "isFollowing" to each user
    const usersWithFollowStatus = users.map(user => {
      return {
        ...user.toObject(),
        isFollowing: followingList.includes(user.email.toString())
      };
    });

    return res.json(usersWithFollowStatus);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const followUser = async (req, res) => {
  try {
    const { userToFollowEmail } = req.body;
    const loggedInUserEmail = req.session.user.email

    if (userToFollowEmail == loggedInUserEmail) {
      return res.json({ success: false, message: 'Same Email Id' });
    }

    const loggedInUser = await UserModel.findOne({ email: loggedInUserEmail });
    const userToFollow = await UserModel.findOne({ email: userToFollowEmail });

    if (!loggedInUser || !userToFollow) {
      return res.json({ success: false, message: 'Invalid user email' });
    }

    // Check if the user is already following the other user
    if (loggedInUser.following.includes(userToFollow.email)) {
      return res.json({ success: false, message: 'Already following this user' });
    }

    // Update follower and following lists
    loggedInUser.following.push(userToFollow.email);
    userToFollow.followers.push(loggedInUser.email);

    await loggedInUser.save();
    await userToFollow.save();

    return res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { userToUnfollowEmail } = req.body;
    const loggedInUserEmail = req.session.user.email;

    const loggedInUser = await UserModel.findOne({ email: loggedInUserEmail });
    const userToUnfollow = await UserModel.findOne({ email: userToUnfollowEmail });

    if (!loggedInUser || !userToUnfollow) {
      return res.json({ success: false, message: 'Invalid user email' });
    }

    // Check if the user is currently following the other user
    if (!loggedInUser.following.includes(userToUnfollow.email)) {
      return res.json({ success: false, message: 'Not following this user' });
    }

    // Remove from follower and following lists
    loggedInUser.following = loggedInUser.following.filter(email => email !== userToUnfollow.email);
    userToUnfollow.followers = userToUnfollow.followers.filter(email => email !== loggedInUser.email);

    await loggedInUser.save();
    await userToUnfollow.save();

    return res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get the user's email before deleting the user
    const user = await UserModel.findById(userId);
    const userEmail = user.email;

    // Delete posts associated with the user's email
    await PostModel.deleteMany({ user: userEmail });

    // Delete the user
    await UserModel.findByIdAndDelete(userId);

    res.json({ success: true, message: 'User and associated posts deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting user and associated posts' });
  }
};

const auth = async (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.session.user ? true : false;
  const user = req.session.user || null;
  const isAdmin = user && user.usertype === 1;

  res.json({ isAuthenticated, user, isAdmin });
};

const searchUser = async (req, res) => {
  try {
    const currentUser = req.session.user;

    // Fetch users excluding the current user
    const users = await UserModel.find({ usertype: 2, _id: { $ne: currentUser._id } });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  registerUser, loginUser, logoutUser, userSession, updateProfile,
  getFollowers, getFollowing, getUsers, followUser, unfollowUser, deleteUser, auth, searchUser,
  sendOTP, getFollow, otpSend, resetPassword
};  