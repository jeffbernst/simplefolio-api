require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')

const {DATABASE_URL, PORT} = require('./config.js')
const app = express()

const {router: usersRouter} = require('./routes/usersRouter')

app.use(bodyparser.json())
app.use('/api/users', usersRouter)
app.use(express.static('public', {extensions: ['html', 'htm']}))
app.use('/node_modules', express.static('node_modules'))

mongoose.Promise = global.Promise

let server

function runServer (databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err)
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`)
          resolve()
        })
        .on('error', err => {
          mongoose.disconnect()
          reject(err)
        })
    })
  })
}

function closeServer () {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}

if (require.main === module) {
  runServer()
}

module.exports = {
  runServer,
  app,
  closeServer
}
