const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    name: {
        type: String
    },
    contents: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }
})

module.exports = mongoose.model('Comment', commentSchema);