const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');
    // console.log('1')
    if (tokenType !== 'Bearer') {
        // console.log('2')
        res.status(401).send({
            errorMessage: '로그인이 필요합니다!'
        });
        return;
    }

    try {
        const { userId } = jwt.verify(tokenValue, 'bans-secret-key');
        // console.log('3')
        User.findById(userId).exec().then((user) => {
            // console.log('4')
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인이 필요합니다!'
        });
        return;
    }
};