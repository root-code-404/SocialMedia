const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');


// Declare io as a global variable
let io;

// Function to set up WebSocket
function setupWebSocket(socketIo) {
  io = socketIo;

  // Set up a connection event
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle your WebSocket events here
    socket.on('likePost', (data) => {
      // Handle the 'likePost' event from the client
      console.log('Received likePost event:', data);
      // Perform any necessary actions here
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

const uploadPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const users = req.session.user;
    const user = users.email;

    // Get current date and time
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}, ${currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

    const newFileUpload = new PostModel({
      user,
      caption,
      filePath,
      date: formattedDate, // Save formatted date
    });

    await newFileUpload.save();

    return res.json({ success: true, message: 'Post uploaded successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Error uploading Post' });
  }
};

const getPostHome = async (req, res) => {
  try {
    const currentUserEmail = req.session.user.email; // Get the currently logged-in user's email

    const profilepost = await PostModel.aggregate([
      {
        $match: {
          user: { $ne: currentUserEmail }, // Exclude posts by the current user
        },
      },
      {
        $lookup: {
          from: 'users', // The name of the user collection
          localField: 'user', // The field from the current collection (PostModel)
          foreignField: 'email', // The field from the user collection (UserModel)
          as: 'userDetails', // Alias for the joined user details
        },
      },
      {
        $unwind: '$userDetails', // Unwind the user details array
      },
      {
        $project: {
          _id: 1, // Include the post's ID
          caption: 1, // Include the caption
          filePath: 1, // Include the file path
          video: 1, // Include the video
          like: 1, // Include the likes
          dislike: 1, // Include the dislikes
          date: 1, // Include the date
          comments: 1, // Include the comments
          'userDetails._id': 1, // Include the user's id
          'userDetails.name': 1, // Include the user's name
          'userDetails.filePath': 1, // Include the user's file path
          'userDetails.email': 1, // Include the user's email
          'userDetails.age': 1, // Include the user's age
          'userDetails.gender': 1, // Include the user's gender
          'userDetails.usertype': 1, // Include the user's usertype
        },
      },
    ]);
    return res.json(profilepost);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Error GET Post' });
  }
};

const likePost = async (req, res) => {
  const { postId } = req.params;
  const { liked } = req.body;
  const user = req.session.user;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.json({ success: false, message: 'Post not found' });
    }

    post.like = post.like || [];
    const userIndex = post.like.indexOf(user.email);

    if (liked && userIndex === -1) {
      post.like.push(user.email);
    } else if (!liked && userIndex !== -1) {
      post.like.splice(userIndex, 1);
    }

    await post.save();

    // Ensure io is defined before emitting events
    if (io) {
      // Emit a postLiked event when a post is liked
      io.emit('postLiked', { postId, liked, user: user.email });
    }

    return res.json({ success: true, like: post.like });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Error updating like status' });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const likedPosts = await PostModel.find({ like: user.email });
    return res.json(likedPosts);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching liked posts' });
  }
};

const getLikedUsers = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await PostModel.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likedUsers = await UserModel.find({ email: { $in: post.like } }, 'name filePath');

    return res.json(likedUsers);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const commentPost = async (req, res) => {
  const { post_id } = req.params;
  const { comment } = req.body;
  const user = req.session.user; // Assuming you have user session

  try {
    const post = await PostModel.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: user.email, // Assuming user.email is the email of the commenter
      username: user.name, // Assuming user.name is the name of the commenter
      profile: user.filePath, // Assuming user.filePath is the file path of the profile image
      comment,
    };

    post.comments.push(newComment);
    await post.save();

    // Emit a newComment event when a new comment is added
    if (io) {
      io.emit('newComment', { postId: post._id, user: user.email, username: user.name, profile: user.filePath, comment });
    }

    return res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getComments = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await PostModel.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json(post.comments);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getPost = async (req, res) => {
  try {
    const users = req.session.user;
    const user = users.email;

    const profilepost = await PostModel.find({ user });
    return res.json(profilepost);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Error GET Post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findByIdAndDelete(postId);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption } = req.body;

    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      caption,
    });

    if (updatedPost) {
      res.json({ success: true, message: 'Post updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error updating Post' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is in session
    if (!req.session || !req.session.user || !req.session.user._id) {
      return res.json({ user, isFollowing: false }); // Not logged in, isFollowing set to false
    }

    const loggedInUserId = req.session.user._id;

    // Fetch the logged-in user's following list
    const loggedInUser = await UserModel.findById(loggedInUserId);
    const followingList = loggedInUser.following;

    const isFollowing = followingList.includes(user.email.toString());

    return res.json({ user, isFollowing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const email = user.email;
    const userPosts = await PostModel.find({ user: email }); // Assuming 'name' field in PostModel represents user email
    return res.json(userPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getUserDetailsAndPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user details by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find posts by user's email
    const posts = await PostModel.find({ user: user.email });
    return res.json({ user, posts });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a new route to get post details by postId
const getPostDetails = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await UserModel.findOne({ email: post.user });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ post, user });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Export the functions as an object
module.exports = {
  setupWebSocket,
  uploadPost,
  getPostHome,
  likePost,
  getLikedPosts,
  getLikedUsers,
  commentPost,
  getComments,
  getPost,
  deletePost,
  editPost,
  getUserProfile,
  getUserPosts,
  getUserDetailsAndPosts,
  getPostDetails,
};
