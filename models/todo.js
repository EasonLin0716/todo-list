// ./models/todo.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  done: { // 完成狀態
    type: Boolean,
    default: false // 預設完成狀態為尚未完成
  }
})
module.exports = mongoose.model('Todo', todoSchema)