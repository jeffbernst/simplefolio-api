const chai = require('chai')
const chaiSubset = require('chai-subset')
const chaiHttp = require('chai-http')
const {app, runServer, closeServer} = require('../server')
const {User} = require('../models/user')
const {TEST_DATABASE_URL} = require('../config')
const {mockSignupData, samplePortfolio, sampleWatchlist} = require('./mock-data')

chai.should()
chai.use(chaiHttp)
chai.use(chaiSubset)

async function tearDownDb () {
  console.warn('Deleting database')
  await User.remove({})
}

describe('login, signup, and check authentication', () => {
  before(() => {
    return runServer(TEST_DATABASE_URL)
  })

  after(async () => {
    await tearDownDb()
    return closeServer()
  })

  // ~~~~~~ USER TESTS ~~~~~~

  let token

  it('should sign up a user', () => {
    return chai.request(app)
      .post('/api/users/')
      .send(mockSignupData)
      .then(response => {
        response.should.have.status(201)
      })
  })

  it('should login and return a token', async () => {
    const hashedPassword = await User.hashPassword(mockSignupData.password)
    await User.create({
      username: mockSignupData.username,
      password: hashedPassword
    })

    return chai.request(app)
      .post('/api/users/login')
      .send({
        username: mockSignupData.username,
        password: mockSignupData.password
      })
      .then(response => {
        response.should.have.status(200)
        response.body.should.have.property('authToken')

        token = response.body.authToken
      })
  })

  it('should get existing user', async () => {
    return chai.request(app)
      .get('/api/users/')
      .set('authorization', `Bearer ${token}`)
      .then(response => {
        response.should.have.status(200)
      })
  })

  it('it shouldn\'t allow someone to access a protected endpoint', () => {
    return chai.request(app)
      .get('/api/users')
      .catch(err => {
        err.should.be.an.instanceOf(Error)
      })
  })

  it('should refresh auth token', async () => {
    return chai.request(app)
      .post('/api/users/refresh')
      .set('authorization', `Bearer ${token}`)
      .then(response => {
        response.should.have.status(200)
        response.body.should.have.property('authToken')
      })
  })

  it('should update portfolio', async () => {
    return chai.request(app)
      .put('/api/users/portfolio')
      .set('authorization', `Bearer ${token}`)
      .send(samplePortfolio)
      .then(response => {
        response.should.have.status(200)
        response.body.portfolio.should.containSubset(samplePortfolio)
      })
  })

  it('should update watchlist', async () => {
    return chai.request(app)
      .put('/api/users/watchlist')
      .set('authorization', `Bearer ${token}`)
      .send(sampleWatchlist)
      .then(response => {
        response.should.have.status(200)
        response.body.portfolio.should.containSubset(sampleWatchlist)
      })
  })
})