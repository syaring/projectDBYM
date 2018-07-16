const mongoose = require('mongoose');

var MeetupsSchema = mongoose.Schema({
  HostId: {type: String, required: true},
  HotPlaces: [],
  MemberList: [], //{id: , location:},
  Category: String,
  isAllInputSet: false
});

module.exports = mongoose.model('Meetups', MeetupsSchema);
