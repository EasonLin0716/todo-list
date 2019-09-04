const express = require('express')
const app = express()
const mongoose = require('mongoose')                    // requiring mongoose



mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })   // setting connection to mongoDB

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
  res.send('website is running')
})

app.listen(3000, () => {
  console.log('Website is running at http://localhost:3000')
})