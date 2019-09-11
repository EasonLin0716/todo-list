const express = require('express')
/* Express 提供的 middleware。透過它我們就能將特定的路由處理程式組合在一起，並使用通用的路由前綴訪問它們 */
const router = express.Router()
/* controller 需要跟資料庫溝通，所以在這裡也需要引入 model Todo */
const Todo = require('../models/todo')
// 載入 auth middleware 裡的 authenticated 方法
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  // sortResult 用於存放透過req.query自index.handlebars下拉式選單中網址取得的值
  const sortResult = {}
  // e.g. sortResult = {}; sortResult = { name: 'asc' }
  sortResult[req.query.sortTarget] = req.query.sortType
  Todo.find({}) // 透過 Todo.find({}) 來讀取所有的資料
    .sort(sortResult)
    .exec((err, todos) => { // .exec 是由 Mongoose 提供，用來執行查詢指令 (query) 的一個方法
      if (err) return console.error(err)
      return res.render('index', { todos: todos })  // 將資料傳給 index 樣板
    })
})


module.exports = router