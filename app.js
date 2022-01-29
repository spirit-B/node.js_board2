const express = require("express"); //express 패키지를 불러온다.
const connect = require('./schemas')
const Boards = require('./schemas/boardSchema')
const path = require('path')
const app = express();

// 라우터 호출
const port = 3000;
const lookupRouter = require('./routes/lookup');
const commentRouter = require('./routes/comment')
const { data } = require("jquery");

// mongoDB 접속
connect();


// 라우터를 여러개 쓸때만 배열 형태로 사용함
app.use('/api', [lookupRouter, commentRouter])

// express에서 body로 전달된 데이터를 json 형식으로 읽기 위함
app.use(express.urlencoded({extended: true}))
app.use(express.json());

// 모듈 사용
app.use('/node_modules', express.static(path.join('/node_modules')))

// view 엔진 설정
app.set('view engine', 'ejs');
// views 폴더에 있는 ejs 파일 불러오기
app.set('views', './views');

// 게시글 목록 조회
app.get('/', (req, res) => {
    res.render('index');
});

// 게시글 작성 페이지
app.get('/write', (req, res) => {
    res.render('write');
});

app.get('/signup', (req, res) =>{
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// 게시글 조회 페이지
app.get('/inboard/:id', async (req, res) => {
    const { id } = req.params;
    const wroteData = await Boards.findById(id);
    res.render('inboard', {list: wroteData})
});

// 글쓴 데이터 삭제
app.post('/inboard/delete/:id', async (req, res) => {
    const { id } = req.params;
    const detailData = await Boards.findById(id);
    if (detailData['password'] === req.body.password) {
        await Boards.deleteOne({ _id: id });
        res.json({success: '삭제 완료!'});
    }
    else {
        res.json({fail: '비밀번호가 다릅니다.'})
    }
});

// 수정할때 비밀번호 확인
app.post('/inboard/modify/:id' , async (req, res) => {
    const { id } = req.params;
    const toModify = await Boards.findById(id);
    if (toModify['password'] === req.body.password) {
        res.json({ success: '수정할 내용을 입력하세요.' })
    } else {
        res.json({ fail: '비밀번호가 다릅니다.' })
    }
});

// 수정한 내용 db에 업데이트
app.post('/inboard/completeModify/:id', async (req, res) => {
    await Boards.findByIdAndUpdate(req.params.id, {contents: req.body.contents});
    res.json({ success: '수정 완료!' })
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});