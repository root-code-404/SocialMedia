const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  email: { type: String, required: true, unique: true }, // Added unique option for email
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  bio: { type: String },
  usertype: { type: Number, default: 2 }, // Added usertype field with default value 1
  filePath: { type: String },// Store the file path
  followers: { type: Array },
  following: { type: Array },
}, { versionKey: false });

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
