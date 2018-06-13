const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
const {DATABASE_URL, PORT, CLIENT_ORIGIN} = require('./config')
const app = express()

const {router: usersRouter} = require('./routes/usersRouter')

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//   next()
// })

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)

app.use(bodyparser.json())
app.use('/api/users', usersRouter)

mongoose.Promise = global.Promise

app.get('/', (req, res) => {
  res.json("server working")
})

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
