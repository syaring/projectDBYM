var express = require('express');
var router = express.Router();
var cors = require('cors');
var axios = require('axios');
var mongoose = require('mongoose');
var _ = require('lodash');

var User = require('../models/User');
var Meetups = require('../models/Meetups');

const DB_URL = "mongodb://Admin:dbymadmin123@ds135061.mlab.com:35061/dbym-db"
mongoose.connect(DB_URL);

const DB = mongoose.connection;

DB.once('open', function () {
  console.log('connected to' + DB_URL);
});

/* GET home page. */
router.get('/', cors(), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user', cors(), function (req, res, next) {
  var newUser = new User({
    UserFbId: req.body.userFbId,
    UserName: req.body.userName,
    UserEmail: req.body.userEmail,
    UserFriends: req.body.userFriends,
    MeetUpsLists: []
  });

  User.find( {UserFbId: req.body.userFbId }, function (err, user) {

    if (!user) {
      newUser = user;
    } else {
      newUser.save(function(err, res) {
        if(err) {
          return false;
        } else {
          return true;
        }
      });
    }
  });
  res.json(newUser);
});

router.put('/user/:user_id', cors(), function (req, res, next) {
  res.status(200).end();
});

router.options('/user', cors(), function (req, res, next) {
  res.status(200).end();
});

router.get('/friends/:fbId', cors(), function (req, res, next) {
  var friends = [];

  User.findOne({UserFbId: req.params.fbId}, function (err, data) {
    if (data) {
      friends = _.map(data.UserFriends);
      res.status(200).json(friends);
    }
  });
});

router.options('/friends/:fbId', cors(), function (req, res, next) {
  res.status(200).end();
});

router.get('/userInfo/:fbId', cors(), function (req, res, next) {
  User.find({UserFbId: req.params.fbId}, function (err, data) {
    if(data) {
      res.status(200).json(data);
    }
  });
});

router.options('/userInfo/:fbId', cors(), function (req, res, next) {
  res.status(200).end();
})

router.get('/meetups/:fbId', cors(), function (req, res, next) {
  let meetupsDetails = [];

  let meetups = [];

  User.find({UserFbId: req.params.fbId}, function (err, data){
    if(data) {
      meetups = _.map(data[0].MeetUpsList);
      for(let i = 0 ; i < meetups.length ; i ++) {
         Meetups.find({_id: meetups[i].meetupsId}, function (err, data){
          if(data) {
            meetupsDetails.push({
              meetupsId: meetups[i].meetupsId,
              isInvited: meetups[i].isInvited,
              isEntered: meetups[i].isEnteredLocation,
              meetupsTitle: data[0].Title,
              meetupsPlace: data[0].Places,
              isAllInputSet: data[0].isAllInputSet,
              MemberList: data[0].MemberList
            });

            if(meetupsDetails.length === meetups.length) {
              res.status(200).json(meetupsDetails);
            }
          }
        });
      }
    }
  });
});

router.post('/meetups', cors(), function (req, res, next) {
  //멤버 리스트 저장
  let memberList = _.map(req.body.guests, function(data) {
    return{
      uid: data.id,
      name: data.name,
      location: { lat: 0, lng: 0}
    }
  });

  //멤버리스트에 호스트 아이디와 위치 저장
  memberList.push({
    uid: req.body.hostId,
    name: req.body.hostName,
    location: {
      lat: req.body.myLocation.lat,
      lng: req.body.myLocation.lng
    }
  });

  var newMeetups = new Meetups({
    HostId: req.body.hostId,
    Title: req.body.title,
    HotPlaces: '',
    Place: '',
    MemberList: memberList,
    Category: req.body.category,
    isAllInputSet: false
  });

  //핫플레이스를 좌표로 변환하여 저장
  let placeList = [];
  var meetupsOId = '';

  for (var i = 0; i < req.body.hotPlaces.length; i++) {
    axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=
      ${encodeURI(req.body.hotPlaces[i])}
      &key=AIzaSyAD7kLRbH0UwpPTNszDx72Fui47lvGjl5w`)
    .then((data) => {
      placeList.push({
        lat: data.data.results[0].geometry.location.lat,
        lng: data.data.results[0].geometry.location.lng
      });

      if (req.body.hotPlaces.length === placeList.length) {
        newMeetups.HotPlaces = placeList;
        
        //새 meetups 저장
        newMeetups.save(function(err, result) {
          if(err) {
            res.status(400).json({});
          } else {
            res.status(200).json({});

            meetupsOId = result._id;

            //모임에 초대된 멤버들의 MeetUpsList에 Meetup Schema id 저장
            for(let i = 0 ; i < memberList.length; i ++) {
              let MeetUps = (memberList[i].uid === req.body.hostId) ?
                {meetupsId: meetupsOId, isInvited: false, isEnteredLocation: true} :
                {meetupsId: meetupsOId, isInvited: true, isEnteredLocation: false} ;

              User.findOneAndUpdate(
                { UserFbId: memberList[i].uid },
                { $push: { MeetUpsList: MeetUps }},
                function(err, res){
                  if (err) {
                    return false;
                  } else {
                    return true;
                  }
                }
              );
            }
          }
      });
    }}
  );
  }
});

router.put('/meetups/:user_id', cors(), function (req, res, next) {
  res.status(200).end();
});

router.options('/meetups', cors(), function (req, res, next) {
  res.status(200).end();
});

// router.post('/meetups/location/:mId', cors(), function (req, res, next) {
//   // Meetups.findOneAndUpdate({_id: req.params.mId, "MemberList.uid": req.body.uid},
//   // {$inc:{location: {
//   //   lat: req.body.lat,
//   //   lng: req.body.lng
//   // }}});
//   Meetups.findOne({_id: req.params.mId}.Meetups.uid )
//   });
//   // function (err, data) {
//   //   if(data) {
//   //     let index = data.MemberList.findIndex(idx => idx.uid === req.body.uid);
//   //     console.log(data.MemberList[index]);
//   //     data.MemberList[index].location = {
//   //       lat: req.body.lat,
//   //       lng: req.body.lng
//   //     }
//   //   }
//   // });
//   res.status(200).json({});
// });

router.options('/meetups/location/:mId', cors(), function (req, res, next) {
  res.status(200).end();
});

module.exports = router;
