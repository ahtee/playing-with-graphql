var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  birthDate: String,
  updatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
