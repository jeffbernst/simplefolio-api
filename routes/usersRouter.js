if (require.main === module) {
  require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const config = require('../config')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const {User} = require('../models/user')
const {jwtStrategy, localStrategy} = require('../strategies')

mongoose.Promise = global.Promise

router.use(passport.initialize())
router.use(jsonParser)

passport.use(localStrategy)
passport.use(jwtStrategy)

const createAuthToken = function (user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  })
}

const jwtAuth = passport.authenticate('jwt', {session: false})
const localAuth = passport.authenticate('local', {session: false})

// create new user and return auth token
router.post('/', async (req, res) => {
  try {
    const requiredFields = ['username', 'password']
    const missingField = requiredFields.find(field => !(field in req.body))

    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      })
    }

    const stringFields = ['username', 'password']
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    )

    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      })
    }

    const explicitlyTrimmedFields = ['username', 'password']
    const nonTrimmedField = explicitlyTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    )

    if (nonTrimmedField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      })
    }

    const sizedFields = {
      password: {
        min: 10,
        max: 72
      }
    }
    const tooSmallField = Object.keys(sizedFields).find(
      field =>
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    )
    const tooLargeField = Object.keys(sizedFields).find(
      field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    )

    if (tooSmallField || tooLargeField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField
          ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
          : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
        location: tooSmallField || tooLargeField
      })
    }

    let {username, password} = req.body

    return User.find({username})
      .count()
      .then(count => {
        if (count > 0) {
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'Username has already been used.',
            location: 'username'
          })
        }

        return User.hashPassword(password)
      })
      .then(hash => {
        return User.create({
          username: username,
          password: hash
        })
      })
      .then(user => {
        return res.status(201).json(user.serialize())
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err)
        }
        res.status(500).json({code: 500, message: 'Internal server error'})
      })

  } catch (err) {
    console.error(err)
  }
})

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize())
  res.json({
    authToken
  })
})

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

router.get('/', jwtAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.send({
      portfolio: user.portfolio,
      watchlist: user.watchlist
    })
  } catch (err) {
    console.error(err)
  }
})

router.put('/portfolio', jwtAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {portfolio: req.body}, {new: true})
    res.send({
      portfolio: user.portfolio,
      watchlist: user.watchlist
    })

  } catch (err) {
    console.error(err)
  }
})

router.put('/watchlist', jwtAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {watchlist: req.body}, {new: true})
    res.send({
      portfolio: user.portfolio,
      watchlist: user.watchlist
    })

  } catch (err) {
    console.error(err)
  }
})

module.exports = {
  router
}
