// A "model" describes the SHAPE of a document in MongoDB,
// and gives you a JS object (User) to query/create/update it.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // MongoDB will reject a second user with the same email
  }
}, { timestamps: true }); // adds createdAt / updatedAt automatically

module.exports = mongoose.model('User', userSchema);
