const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('website is running')
})

app.listen(3000, () => {
  console.log(`express is running on http://localhost:3000`)
})