const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    name: {
        type: String,
    },
    contents: {
        type: String,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    commentId: {
        type: mongoose.SchemaType.ObjectId,
        ref: "User",
        required: true,
    }
})

commentSchema.virtual('commentId').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Comment', commentSchema);