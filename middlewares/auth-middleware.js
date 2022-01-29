const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인이 필요합니다!'
        });
        return;
    }

    try {
        const { userId } = jwt.verify(tokenValue, 'bans-secret-key');
        
        User.findById(userId).exec().then((user) => {
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