const { filter } = require("async");
const express = require("express");
const Boards = require('../schemas/boardSchema') // db 불러오기
const { format } = require("express/lib/response");
const { findOneAndUpdate, db } = require("../schemas/boardSchema");
const userSchema = require("../schemas/userSchema");
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();
const jwt = require('jsonwebtoken');


// json 형식의 데이터를 파싱
router.use(express.json())
router.use(express.urlencoded({extended: true}));

// 회원가입 API
router.post('/signup', async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다!'
            });
            return; // 리턴을 하지 않으면 두 데이터가 일치해도 아래 코드가 실행됨.
        }
    
        if (nickname === password) {
            res.status(400).send({
                errorMessage: '닉네임과 비밀번호가 같지 않게 기입해주세요!'
            })
            return;
        }
    
        const existUsers = await userSchema.findOne({nickname}).exec();
        if (existUsers) {
            res.status(400).send({
                errorMessage: '이미 존재하는 닉네임입니다!'
            });
            return;
        }
        const user = new userSchema({ nickname, password });
        await user.save();
    
        res.status(201).send({ success: '회원가입에 성공했습니다!'})
    } catch {
        res.status(400).send({ errorMessage: '조건에 맞지 않는 입력값이 있습니다.' })
    }
});

// 로그인 API
router.post('/auth', async(req, res) => {
    const { nickname, password } = req.body;

    const user = await userSchema.findOne({ nickname, password }).exec();

    if (!user) {
        res.status(401).send({
            errorMessage: '닉네임 또는 패스워드를 확인해주세요!'
        });
        return;
    }

    const token = jwt.sign({ userId: user._id, nickname: user.nickname }, 'bans-secret-key');
    res.send({
        token,
        success: '로그인 성공!'
    });
});

// 글쓰기 데이터 저장 -> app.js : app.use(express.json())
router.post('/toWrite',  authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { title, createDate, contents } = req.body;
    
    // 빈칸이 있는지 없는지 체크
    try {
        await Boards.create({ name: user['nickname'], title, createDate, contents })
        res.json({ success: '글을 저장했습니다!' })
    } catch {
        res.json({fail: '내용 외에 빈칸이 없게 작성해주세요!'})
    }
});

// 메인 페이지 데이터 불러오기
router.get('/fromWrite', async (req, res) => {
    const createdData = await Boards.find().exec();
    res.json({list: createdData});
});

// 다른 js 파일에서 참조하기 위한 명령어
module.exports = router;
