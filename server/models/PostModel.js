const mongoose = require('mongoose');

const postUploads = new mongoose.Schema({
        user: {
                type: String,
                required: true
        },
        caption: {
                type: String,
                required: true
        },
        filePath: {
                type: String,
                required: true

        },
        video: {
                type: String,
        },
        like: {
                type: Array,
        },
        date: {
                type: String, // Add the date field here
        },
        comments: [
                {
                        user: {
                                type: String,
                        },
                        username: {
                                type: String,
                        },
                        profile: {
                                type: String
                        },
                        comment: {
                                type: String,
                        }
                }]

});

const PostModel = mongoose.model('posts', postUploads);



module.exports = PostModel;