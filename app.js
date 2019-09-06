const express = require('express')
const app = express()
const mongoose = require('mongoose') // requiring mongoose

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

app.get('/', (req, res) => {
  Todo.find({}) // 透過 Todo.find({}) 來讀取所有的資料
    .sort({ name: 'asc' }) // 使用 .sort 把取得的資料用 name 以「升冪 (ascending)」的規則排序
    .exec((err, todos) => { // .exec 是由 Mongoose 提供，用來執行查詢指令 (query) 的一個方法
      if (err) return console.error(err)
      return res.render('index', { todos: todos })  // 將資料傳給 index 樣板
    })
})
// 列出全部 Todo
app.get('/todos', (req, res) => {
  return res.redirect('/')
})
// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
  return res.render('new')
})
// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('detail', { todo: todo })
  })
})
// 新增一筆  Todo
app.post('/todos', (req, res) => {
  // 建立 Todo model 實例
  const todo = new Todo({
    name: req.body.name, // name 是從 new 頁面 form 傳過來
  })
  // 存入資料庫
  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/') // 新增完成後，將使用者導回首頁
  })
})
// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('edit', { todo: todo })
  })
})
// 修改 Todo
app.put('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.name = req.body.name
    if (req.body.done === 'on') {
      todo.done = true
    } else {
      todo.done = false
    }
    todo.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/todos/${req.params.id}`)
    })
  })
})
// 刪除 Todo
app.delete('/todos/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

app.listen(3000, () => {
  console.log('Website is running at http://localhost:3000')
})