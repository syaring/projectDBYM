var express = require('express');
var router = express.Router();
var cors = require('cors');
var axios = require('axios');
var mongoose = require('mongoose');
var _ = require('lodash');

var User = require('../models/User');
var Meetups = require('../models/Meetups');

const USERS = [
];

const MEETUPS = [
];

let id = 0;

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

// router.get('/users', cors(), function (req, res, next) {
//   res.json({
//     users: USERS
//   });
// });

// router.options('/users', cors(), function (req, res, next) {
//   res.status(200).end();
// });

router.post('/user', cors(), function (req, res, next) {
  var newUser = new User({
    UserFbId: req.body.userFbId,
    UserName: req.body.userName,
    UserEmail: req.body.userEmail,
    UserFriends: req.body.userFriends,
    MeetUpsLists: []
  });
  
  User.findOne ( {"UserFbId": req.body.userFbId }, function (err, user) {
    if (user) {
      newUser = user;
    } else {
      newUser.save(function(err) {
        if(err) {
          res.status(400).json({});
        } else {
          res.status(200).json({});
        }
      });
    }
  });
  res.json(newUser);
});

router.put('/user/:user_id', cors(), function (req, res, next) {
  res.status(200).end();
});

{
  // router.get('/user/:id', cors(), function (req, res, next) {
  //   console.log(req.params.id);

  //   User.findOne ({
  //     "UserFbId": req.params.id
  //   }, function (err, user) {
  //     if(user) {
  //       res.json(user);
  //       console.log(user);
  //     }
  //   });
  //   res.status(200).json({});
  // });
}
router.options('/user', cors(), function (req, res, next) {
  res.status(200).end();
});


router.get('/friends/:fbId', cors(), function (req, res, next) {
  var friends = [];

  User.findOne({"UserFbId": req.params.fbId}, function (err, data) {
    if (data) {
      friends = _.map(data.UserFriends);
      res.status(200).json(friends);
    }
  });
});

router.options('friends/:fbId', cors(), function (req, res, next) {
  res.status(200).end();
});



// router.post('/meetups', cors(), function (req, res, next) {
//   console.log(req.params);
//   //User.findOne({"UserFbId": req.params.})
//   res.json({});
// });

// router.put('/meetups:user_id', cors(), function (req, res, next) {

// });
// router.options('/user', cors(), function (req, res, next) {
//   res.status(200).end();
// });

// router.put('/user/:id', cors(), function (req, res, next) {
//   // code goes here..
//   if (USERS[req.params.id].completed) {
//     USERS[req.params.id].completed = false;
//   }else{
//     USERS[req.params.id].completed = true;
//   }
//   res.status(200).end();
// });

// router.get('/user:id', cors(), function (req, res, next){
//   res.json({
//     user: USERS[0]
//   })
// });

// router.options('/user/:id', cors(), function (req, res, next){
//   res.status(200).end();
// });

// router.get('/meetups', cors(), function (req, res, next) {
//   res.json({
//     meetups: MEETUPS
//   });
// });

router.post('/meetups', cors(), function (req, res, next) {
  //멤버 리스트 저장
  let memberList = _.map(req.body.guests, function(id) {
    return{
      uid: id,
      location: { lat: 0, lng: 0}
    }
  });
  //멤버리스트에 호스트 아이디와 위치 저장
  memberList.push({
    uid: req.body.hostId,
    location: {
      lat: req.body.myLocation.lat,
      lng: req.body.myLocation.lng
    }
  });

  var newMeetups = new Meetups({
    HostId: req.body.hostId,
    HotPlaces: '',
    MemberList: memberList,
    Category: req.body.category,
    isAllInputSet: false
  });

  //핫플레이스를 좌표로 변환하여 저장
  let placeList = [];

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

        newMeetups.save(function(err) {
          if(err) {
            res.status(400).json({});
          } else {
            res.status(200).json({});
          }
        });
      }
    });
  }
});

  router.put('/meetups/:user_id', cors(), function (req, res, next) {
    res.status(200).end();
  });

  router.options('/meetups', cors(), function (req, res, next) {
    res.status(200).end();
  });

//   newMeetups.save(function(err) {
//     if(err) {
//       res.redirect('/');
//     } else {
//       res.redirect('/');
//     }
//   });

  // const newMeetUp = {
  //   hostId: req.body.hostId,
  //   hotPlaces: req.body.hotPlaces,
  //   guests: req.body.guests,
  //   category: req.body.category,
  //   myLoctation: req.body.myLoctation
  // };

  // MEETUPS.push(newMeetUp);

  // res.json(newMeetUp);
// });

// router.options('/meetup', cors(), function (req, res, next) {
//   res.status(200).end();
// });


module.exports = router;
