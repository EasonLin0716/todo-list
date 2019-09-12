const express = require('express')
const app = express()
// 判別開發環境
if (process.env.NODE_ENV !== 'production') { // 如果不是 production 模式
  require('dotenv').config() // 使用 dotenv 讀取 .env 檔案
}

const mongoose = require('mongoose') // requiring mongoose
const session = require('express-session')
// 載入 passport
const passport = require('passport')

// 引用 body-parser
const bodyParser = require('body-parser');
// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// 引用 express-handlebars
const exphbs = require('express-handlebars');

// 引用 method-override
const methodOverride = require('method-override')





// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定 method-override
app.use(methodOverride('_method'))

app.use(session({
  secret: 'your secret key', // secret: 定義一組屬於你的字串做為私鑰
  resave: false, // 當設定為 true 時，會在每一次與使用者互動後，強制把 session 更新到 session store 裡
  saveUninitialized: true, // 強制將未初始化的 session 存回 session store。未初始化表示這個 session 是新的而且沒有被修改過，例如未登入的使用者的 session
}))

// 使用 Passport 
app.use(passport.initialize())
app.use(passport.session())
// 載入 Passport config
require('./config/passport')(passport) // 這裡的 passport 是一個 Passport 套件的 instance
// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated() // 辨識使用者是否已經登入的變數，讓 view 可以使用
  next()
})

// mongoDB 連線
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true, useCreateIndex: true })

// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// on 替連線事件，註冊事件監聽器，只要有觸發 error 就印出 error 訊息
db.on('error', () => {
  console.log('mongodb error!')
})

// once 替連線事件，註冊「單一次」的事件監聽器，最多只會觸發一次，且觸發後會立刻解除事件監聽器。
db.once('open', () => {
  console.log('mongodb connected!')
})

// 載入 todo model
const Todo = require('./models/todo')

// 載入路由
app.use('/', require('./routes/homes'))
app.use('/todos', require('./routes/todo'))
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auths'))


app.listen(3000, () => {
  console.log('Website is running at http://localhost:3000')
})