const express = require('express')
const app = express()
const mongoose = require('mongoose') // requiring mongoose
const session = require('express-session')

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
  saveUninitialized: true,
}))

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true }) // setting connection to mongoDB

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

app.use('/', require('./routes/homes'))
app.use('/todos', require('./routes/todo'))
app.use('/users', require('./routes/users'))


app.listen(3000, () => {
  console.log('Website is running at http://localhost:3000')
})