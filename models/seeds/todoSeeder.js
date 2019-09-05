// 透過這個 Seeder 新增資料，所以我們會載入 mongoose 與 Todo model
const mongoose = require('mongoose')
const Todo = require('../todo')

// 透過 Mongoose 來跟 MongoDB 連線
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  // 透過一個 for 迴圈在資料庫中新增一批種子資料
  for (let i = 0; i < 10; i++) {
    // 因為我們使用 Mongoose 這個 ODM，所以可以用物件導向的語法，呼叫 Todo 這個 model 物件，然後使用 Mongoose 為該物件內建的 create 方法，去新增資料
    Todo.create({ name: 'name-' + i })
  }

  console.log('done')
})