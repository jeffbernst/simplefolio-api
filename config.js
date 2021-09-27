require('dotenv').config()

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/test'
exports.PORT = process.env.PORT || 8080
exports.JWT_SECRET = process.env.JWT_SECRET
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test'
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000'
exports.COIN_MARKET_CAP_KEY = process.env.COIN_MARKET_CAP_KEY