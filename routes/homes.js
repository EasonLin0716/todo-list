const express = require('express')
/* Express 提供的 middleware。透過它我們就能將特定的路由處理程式組合在一起，並使用通用的路由前綴訪問它們 */
const router = express.Router()
/* controller 需要跟資料庫溝通，所以在這裡也需要引入 model Todo */
const Todo = require('../models/todo')

router.get('/', (req, res) => {
  Todo.find({}) // 透過 Todo.find({}) 來讀取所有的資料
    .sort({ name: 'asc' }) // 使用 .sort 把取得的資料用 name 以「升冪 (ascending)」的規則排序
    .exec((err, todos) => { // .exec 是由 Mongoose 提供，用來執行查詢指令 (query) 的一個方法
      if (err) return console.error(err)
      return res.render('index', { todos: todos })  // 將資料傳給 index 樣板
    })
})


module.exports = router