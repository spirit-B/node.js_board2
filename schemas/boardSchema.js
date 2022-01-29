const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    password: {
        type: String,
        required: true
    },
    contents: {
        type: String
    }
});

boardSchema.virtual('boardId').get(function () {
    return this._id.toHexString();
});

boardSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Board', boardSchema);