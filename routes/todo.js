const express = require('express')
/* Express 提供的 middleware。透過它我們就能將特定的路由處理程式組合在一起，並使用通用的路由前綴訪問它們 */
const router = express.Router()
/* controller 需要跟資料庫溝通，所以在這裡也需要引入 model Todo */
const Todo = require('../models/todo')


/* --- 設定 /todos 路由 --- */

// 列出全部 Todo
router.get('/', (req, res) => {
  return res.redirect('/')
})
// 新增一筆 Todo 頁面
router.get('/new', (req, res) => {
  return res.render('new')
})
// 顯示一筆 Todo 的詳細內容
router.get('/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('detail', { todo: todo })
  })
})
// 新增一筆  Todo
router.post('/', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    return res.render('edit', { todo: todo })
  })
})
// 修改 Todo
router.put('/:id', (req, res) => {
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
router.delete('/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})




module.exports = router