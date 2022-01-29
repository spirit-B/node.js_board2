const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        match: /[A-Za-z0-9]{3,}/,
        default: "",
    },
    password: {
        type: String,
        match: /[A-Za-z0-9]{4,}/,
        default: "",
    }
});

userSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', userSchema);