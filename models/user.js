const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  userEmail: String,
  password: String,
  portfolio: [Object],
  watchlist: Array
})

userSchema.methods.serialize = function () {
  return {
    userEmail: this.userEmail || '',
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
