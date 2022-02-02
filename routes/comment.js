const express = require("express");
const Boards = require('../schemas/boardSchema');
const userSchema = require("../schemas/userSchema");
const Comments = require('../schemas/commentSchema');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');

// json 형식의 데이터를 파싱
router.use(express.json())
router.use(express.urlencoded({extended: true}));


// 댓글 DB
router.post('/comment/:id', authMiddleware, async(req, res) => {
    // 현재 locals에 저장된 유저 정보들을 불러온다.
    const { user } = res.locals;
    const { contents, createDate } = req.body;

    // console.log(req.headers.authorization);
    // console.log(user['nickname']); // user에 저장된 정보 중 key가 nickname인것을 찾는다.
    // console.log(req.params.id);
    try {
        await Comments.create({ name: user['nickname'], contents, createDate, articleId: req.params.id});
        res.json({ success: '댓글을 작성하셨습니다!'})
    } catch (error) {
        res.json({ fail: '댓글 내용을 작성해주세요!'})
    }
});

// 상세페이지 조회 시 token check
router.get('/gettoken/:id', authMiddleware, async(req, res) => {
    const { user } = res.locals;
    const { id } = req.params;
    const wroteComment = await Comments.find({articleId: id}).populate('articleId');
    res.json({ nickname: user['nickname'], commentlist: wroteComment });
});

// 댓글 삭제
router.post('/delcomment/:id', authMiddleware, async(req, res) => {
    const { id } = req.params;
    try {
        await Comments.deleteOne({ _id: id });
        res.json({ success: '댓글을 삭제했습니다!'});
    } catch {
        res.json({ fail: '잘못된 접근입니다!!'});
    }
});

// 댓글 수정
router.post('/modicomment/:id', authMiddleware, async(req, res) => {
    const { id } = req.params;
    try {
        if (req.body.modified === "") {
            res.json({ notInput: '내용을 입력하세요!' });
            return;
        }
        await Comments.findByIdAndUpdate(id, {contents: req.body.modified});
        res.json({ success: '댓글 수정 완료!'})
    } catch {
        res.json({ fail: '잘못된 접근입니다!!'});
    }
});

module.exports = router;