const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  UserFbId: {type:String, required: true, unique: true},
  UserName: String,
  UserEmail: String,
  UserFriends: Array,
  MeetUpsList: Array, //{meetupId, invited, entered}
  Lat: { type: Number, default: 0 },
  Lng: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
