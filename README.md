<!-- Social Media Project Banner -->

# Social Media Project

A comprehensive social media platform developed using the MERN stack, offering a range of features for users and administrators.

## 📌 Table of Contents
- [Features](#features)
  - [User Authentication](#user-authentication)
  - [Post Management](#post-management)
  - [User Profiles](#user-profiles)
  - [Administrative Functionalities](#administrative-functionalities)
  - [Real-Time Features](#real-time-features)
- [Technologies Used](#technologies-used)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Usage](#usage)
  - [Clone the repository](#1-clone-the-repository)
  - [Install server dependencies](#2-install-server-dependencies)
  - [Install client dependencies](#3-install-client-dependencies)
  - [Run the application](#4-run-the-application)
  - [User Interaction](#5-user-interaction)
  - [Additional Administrative Functionality](#6-additional-administrative-functionality)
  - [Real-Time Features](#7-real-time-features)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

### User Authentication
- 🔐 **Login**: Users can log in using their email.
- 🚪 **Logout**: Users can log out.
- 🕵️‍♂️ **Password Recovery**: Users can recover forgotten passwords.

### Post Management
- 📝 **Upload Posts**: Users can upload posts.
- 👀 **View Posts**: Users can view posts.
- ❤️ **Interact with Posts**: Users can like, comment, and share posts.
- 📈 **View Counts**: Users can see the count of likes and comments.
- 🗑️ **Delete Posts**: Users can delete their own posts.

### User Profiles
- 👤 **View/Edit Profiles**: Users can view and edit their profiles.
- 👥 **Following/Followers Lists**: Users can see their following and followers lists.
- 🔍 **Search Users**: Users can search for other users.
- 🧑‍💻 **View Others' Profiles/Posts**: Users can view other users' profiles and posts.
- ➕ **Follow/Unfollow**: Users can follow and unfollow other users.

### Administrative Functionalities
- 🛡️ **Login/Logout**: Admins can log in and log out.
- 🔍 **User Management**: Admins can view all users, search for users, and view each user's profile and posts.
- 🗑️ **Post Deletion**: Admins can delete posts and users.

### 🚀 Real-Time Features
- Real-time updates for likes and comments using **Socket.io**

### 🌐 Additional User Interaction
- Users can share posts with a URL to non-logged-in users.

## 💻 Technologies Used

### Backend
- **MongoDB**: 📁 NoSQL database for user data, posts, and other information.
- **Express.js**: 🚀 Backend web application framework for handling HTTP requests and routes.
- **Node.js**: 🚀 JavaScript runtime environment for server-side development.
- **Express-session**: 🔐 Middleware for handling user sessions.
- **Helmet**: 🛡️ Middleware to enhance Express app security by setting various HTTP headers.
- **Nodemailer**: 📬 Module for sending emails to users, e.g., for password reset functionality.
- **Bcrypt**: 🔒 Library for hashing and salting passwords to enhance security.
- **Socket.io**: 🚀 Library for real-time, bidirectional, and event-based communication.

### Frontend
- **React**: ⚛️ JavaScript library for building dynamic and responsive user interfaces.
- **React Bootstrap**: 🚀 Popular front-end framework for creating a visually appealing UI.
- **Axios**: 🚀 Promise-based HTTP client for making API requests.
- **Fuse.js**: 🔍 Fuzzy-search library for efficient and flexible searching.
- **React Icons**: 🔧 Collection of customizable SVG icons for React applications.

## 📖 Usage

### 1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/social-media-project.git
   cd social-media-project
