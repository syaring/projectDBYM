const mongoose = require('mongoose');

var MeetupsSchema = mongoose.Schema({
  HostId: {type: String, required: true},
  Title: String,
  HotPlaces: {},
  Place: String,
  MemberList: [String], //{id: , name},
  isAllInputSet: false
});

module.exports = mongoose.model('Meetups', MeetupsSchema);
