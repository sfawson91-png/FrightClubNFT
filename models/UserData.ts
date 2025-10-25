const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userID: Number,
  address: String,
  ipAddress: String,
});

// Check if the model is already registered
const UserData = mongoose.models.UserData || mongoose.model('UserData', userDataSchema);

module.exports = UserData;