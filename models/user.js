const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  username: String,
  password: String,
  portfolio: [{
    id: Number,
    name: String,
    symbol: String,
    quantity: Number
  }],
  watchlist: [{
    id: Number,
    name: String,
    symbol: String
  }]
})

userSchema.methods.serialize = function () {
  return {
    username: this.username || '',
    id: this._id
  }
}

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10)
}

const User = mongoose.model('user', userSchema)

module.exports = {User}
