// routes/user.js
const express = require('express')
const router = express.Router()
const User = require('../models/users')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入檢查
router.post('/login', (req, res) => {
  res.send('login')
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email: email }).then(user => {
    if (user) {
      console.log('user already exists')
      res.render('/register', {
        name,
        email,
        password,
        password2
      })
    } else {
      const newUser = new User({
        name,
        email,
        password
      })
        .save()
        .then(user => {
          res.redirect('/')
        })
        .catch((err) => console.log(err))
    }
  })
})



















// router.post('/register', (req, res) => {
//   const { name, email, password, password2 } = req.body
//   // 使用 Mongoose 提供的 findOne 方法
//   User.findOne({ email: email }).then(user => {
//     if (user) {
//       console.log('User already exists')
//       res.render('register', { // 使用者已經註冊過
//         name,
//         email,
//         password,
//         password2
//       })
//     } else {
//       const newUser = new User({ // 如果 email 不存在就直接新增
//         name,
//         email,
//         password
//       })
//       newUser
//         .save()
//         .then(user => {
//           res.redirect('/') // 新增完成導回首頁
//         })
//         .catch(err => console.log(err))
//     }
//   })
// })

// 登出
router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router