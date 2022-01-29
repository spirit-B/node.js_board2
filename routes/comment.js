const express = require("express");
const Boards = require('../schemas/boardSchema');
const userSchema = require("../schemas/userSchema");
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware')

// json 형식의 데이터를 파싱
router.use(express.json())
router.use(express.urlencoded({extended: true}));

router.post('/comment', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { name, contents } = req.body;

    try {
        
    } catch (error) {
        
    }
});

module.exports = router;