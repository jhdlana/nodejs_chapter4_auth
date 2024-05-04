// 필요한 모듈들을 불러옵니다.
const express = require('express');
const posts = require('./posts')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const secretText = 'secretText'
const refreshSecretText = 'refreshSecretText'

const app = express()

app.use(cors({
    origin : 'http://127.0.0.1:5500',
    methods: 'POST, GET'
}))

let refreshToken = [];
app.use(cookieParser())
app.use(express.json())

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = {name: username}
    console.log(`${req.method} 요청이 들어옴`)

    const accessToken = jwt.sign(user, secretText, {expiresIn: '30s'})

    res.json({accessToken : accessToken})
})

app.get('/posts', authMiddleware, (req, res) => {
    res.json(posts)
    console.log(`${req.method} 요청이 들어옴`)
})

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, secretText, (err, user) => {
        if(err) return res.sendStatus(403)

        req.user = user;
        next()
    })
}


// 서버가 4000번 포트에서 듣기를 시작합니다. 서버가 시작되면 콘솔에 메시지를 출력합니다.
const port = 4000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});