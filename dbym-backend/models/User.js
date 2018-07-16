const mongoose = require('mongoose');
//const meetups = require('./User');

var UserSchema = mongoose.Schema({
  UserFbId: {type:String, required: true, unique: true},
  UserName: String,
  UserEmail: String,
  UserFriends: [{}],
  MeetUpsList: [] //{meetupId: , invited, inputLocation}
});

module.exports = mongoose.model('User', UserSchema);