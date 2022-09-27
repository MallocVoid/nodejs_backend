const express = require('express')
var bodyParser = require('body-parser')
const db = require('./database')
var cors = require('cors');
const app = express()
app.use(cors());
app.use(express.json());
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    res.send({ text: 'Hello World!' })
  })
  
  app.get('/apps', db.getApps)
  app.get('/app/:id', db.getAppById)
  app.post('/app', jsonParser, db.createApp)
  app.put('/app', jsonParser, db.updateApp)
  app.delete('/app/:id', db.deleteApp)

  app.post('/login', db.login)
  app.post('/register', jsonParser, db.register)

module.exports = app