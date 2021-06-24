// Call module mongoose to connect db
const mongoose = require('mongoose')

// Used scheme to build structure collection
const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    },
    postType: {
        type: String,
        enum: ['text', 'image', 'video'],
        required: true
    },
    content: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    video: {
        type: String,
        trim: true,
        default: null
    },
    comments: []
}, {timestamps: true})

const PostInfo = mongoose.model('posts', postSchema)

module.exports = PostInfo