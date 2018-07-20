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

const getCentroid = function (coord) {
	var center = coord.reduce(function (x,y) {
		return [x[0] + y[0]/coord.length, x[1] + y[1]/coord.length] 
	}, [0,0])
	return center;
};

const getNearest = function (center, hotplCoords) {
  debugger
  var nearest = hotplCoords[0];
  var distance = Math.sqrt(
    (Math.pow(center[0]-hotplCoords[0][0])) +
    (Math.pow(center[1]-hotplCoords[0][1]))
  );
  
  if(hotplCoords.length === 1){
    return nearest;
  }

  for(let i = 1 ; i < hotplCoords.length ; i ++){
    let tmp = Math.sqrt(
      (Math.pow(center[0] - hotplCoords[i][0])) +
      (Math.pow(center[1] - hotplCoords[i][1]))
    );

    if(distance > tmp) {
      nearest = hotplCoodrs[i];
    }
  }

  return nearest;
};

/* GET home page. */
router.get('/', cors(), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//사용자 로그인 및 접속
router.post('/user', cors(), (req, res, next) => {
  User.findOne({ UserFbId: req.body.userFbId }).then(user => {
    if (user) {
      req.body.userFriends.forEach((userData, index) => {
        User.findOne({ UserFbId: userData.id }).then(friend => {
          if (friend) {
            if (user.UserFriends.indexOf(friend._id) === -1) {
              user.UserFriends.push(friend._id);
            }

            if (index === req.body.userFriends.length - 1) {
              user.save(function (err, data) {
                if (err) {
                  res.status(400).json(err);
                } else {
                  res.status(200).json(user);
                }
              });
            }
          } else {
            var newFriend = new User({
              UserName: userData.name,
              UserFbId: userData.id
            });

            newFriend.save((err, data) => {
              user.UserFriends.push(data._id);

              if (req.body.userFriends.length === user.UserFriends) {
                user.save(function (err, data) {
                  if (!err) {
                    res.status(200).json(data);
                  } else {
                    res.status(400).json({
                      error: err
                    });
                  }
                });
              }
            });
          }
        });
      });

      return;
    }

    var newUser = new User({
      UserFbId: req.body.userFbId,
      UserName: req.body.userName,
      UserEmail: req.body.userEmail,
      UserFriends: []
    });

    var promise = [];
    let count = 0;

    req.body.userFriends.forEach((userData, index) => {
      User.findOne({ UserFbId: userData.id }).then(user => {
        if (user) {
          newUser.UserFriends.push(user._id);
          user.UserFriends.push(newUser._id);
          promise.push(user.save());
        } else {
          var newFriend = new User({
            UserName: userData.name,
            UserFbId: userData.id
          });

          promise.push(newFriend.save());
        }

        count++;

        if (count === req.body.userFriends.length) {
          Promise.all(promise).then((results) => {
            results.forEach(result => {
              if (newUser.UserFriends.indexOf(result._id) === -1) {
                newUser.UserFriends.push(result._id);
              }
            });

            newUser.save((err, data) => {
              if (err) {
                res.status(400).json(err);
              } else {
                res.status(200).json(data);
              }
            });
          });
        }
      });
    });
  });
});

router.put('/user/:user_id', cors(), function (req, res, next) {
  res.status(200).end();
});

router.options('/user', cors(), function (req, res, next) {
  res.status(200).end();
});

//사용자의 친구 리스트 가져오기
router.get('/friends/:fbId', cors(), function (req, res, next) {
  var friends = [];

  User.findOne({UserFbId: req.params.fbId}, function (err, me) {

    if (err) {
      return res.status(400).json({
        error: 'error'
      });
    }

    if (!me) {
      return res.status(400).json({
        error: 'User Not Found'
      });
    }

    for(let i = 0 ; i < me.UserFriends.length ; i ++) {
      User.findOne({_id: me.UserFriends[i]}, function (err, user) {
        friends.push({
          userName: user.UserName,
          userOid: me.UserFriends[i]
        });

        if(friends.length === me.UserFriends.length) {
          res.status(200).json({friends});
        }
      });
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

//사용자의 모임 정보 가져오기
router.get('/meetups/:fbId', cors(), function (req, res, next) {
  let meetupsDetails = [];
  let meetups = [];

  User.findOne({UserFbId: req.params.fbId}, function (err, user){
    if(user) {
      let uOid = user._id;
      meetups = _.map(user.MeetUpsList);
      
      if(meetups.length === 0){
        res.status(200).json([]);
      } else {
        for(let i = 0 ; i < meetups.length ; i ++) {
          Meetups.findById(meetups[i].meetupsId, function (err, data){
            if(data) {
              let memberList = [];
              let count = 0;

              for(let j = 0 ; j < data.MemberList.length ; j++ ){
                User.findById(data.MemberList[j], function (err, usr){
                  if(usr) {
                    memberList.push(usr.UserName);
                    count ++;
                  }

                  if(count === data.MemberList.length) {
                    meetupsDetails.push({
                      meetupsId: meetups[i].meetupsId,
                      isInvited: meetups[i].isInvited,
                      isEntered: meetups[i].isEntered,
                      meetupsTitle: data.Title,
                      meetupsPlace: data.Place,
                      isAllInputSet: data.isAllInputSet,
                      MemberList: memberList
                    });

                    if(meetupsDetails.length === meetups.length) {
                      res.status(200).json(meetupsDetails);
                    }
                  }
                })
              }
            }
          });
        }
      }
    }
  });
});

//모임 생성
router.post('/meetups', cors(), function (req, res, next) {
  User.findOne({UserFbId: req.body.hostId}, function(err, host) {
    let hostId = host._id;

    //멤버들의 oid 매핑
    let memberList = _.map(req.body.guests, function(data) {
      return data.userOid;
    });
    //멤버리스트에 호스트 oid 저장
    memberList.push(hostId);

    User.findById(hostId, function (err, user) {
      if (err) {
        return false;
      }

      user.Lat = req.body.myLocation.lat;
      user.Lng = req.body.myLocation.lng;

      user.save(function (err, updateUser) {
        if(err){
          return false;
        }
        return true;
      });
    });

    var newMeetups = new Meetups({
      HostId: hostId,
      Title: req.body.title,
      HotPlaces: '',
      Place: '',
      MemberList: memberList,
      isAllInputSet: false
    });

    let placeList = [];
    var meetupsOId = '';

    //핫플레이스 이름->좌표로 변환후 저장
    for (var i = 0; i < req.body.hotPlaces.length; i++) {
      axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=
        ${encodeURI(req.body.hotPlaces[i])}
        &key=AIzaSyB3GzdWkIgLmw7Ei_QisqgPsjyIVTdX6CE`)
      .then((data) => {
        placeList.push({
          lat: data.data.results[0].geometry.location.lat,
          lng: data.data.results[0].geometry.location.lng
        });

        //비동기.. 핫플에 대한 모든 좌표를 받아왔을 경우에 진행
        if (req.body.hotPlaces.length === placeList.length) {
          newMeetups.HotPlaces = placeList;
        
          //새 meetups 저장
          newMeetups.save(function(err, result) {
            if(err) {
              res.status(400).json({
                err: 'error'
              });
            } else {
              //저장된 Meetups 값 반환
              meetupsOId = result._id;

              //모임에 초대된 멤버들의 MeetUpsList에 Meetup Schema id 저장
              for(let i = 0 ; i < memberList.length; i ++) {
                let MeetUps = (memberList[i] === hostId) ?
                  {meetupsId: meetupsOId, isInvited: false, isEntered: true} :
                  {meetupsId: meetupsOId, isInvited: true, isEntered: false} ;

                User.findById(memberList[i], function (err, user) {
                  if (err) {
                    return false;
                  }
                  user.MeetUpsList.push(MeetUps);

                  user.save(function (err, updateUser) {
                    if(err){
                      return false;
                    }
                    return true;
                  });
                });
              }
              res.status(200).json({result});
            }
          });
        }}
      );
    }
  })
});

router.put('/meetups/:user_id', cors(), function (req, res, next) {
  res.status(200).end();
});

router.options('/meetups', cors(), function (req, res, next) {
  res.status(200).end();
});


//사용자 위치 입력에 따른 DB업데이트
router.post('/meetups/setloca/:mId', cors(), async (req, res, next) => {
  const meetupId = req.params.mId;
  const userId = req.body.uid;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const membersLocation = [];
  
  User.findOne({UserFbId: userId}, function (err, user) {
    if(user) {
      let index = user.MeetUpsList.map(function (o) {
        return o.meetupsId.toString();
      }).indexOf(meetupId);

      user.Lat = lat;
      user.Lng = lng;

      const copy = Object.assign({}, user.MeetUpsList[index]);

      copy.isEntered = true;

      user.MeetUpsList.set(index, copy);

      user.save(function (err, data) {
        if (err) {
          res.status(400).json(err);
        } else {
          Meetups.findById(meetupId, function (err, mu) {
            let members = mu.MemberList.map( function (member) {
              return member;
            });

            let places = mu.HotPlaces.map( (function (station) {
              return [station.lat, station.lng];
            }));

            let trueCount = 0;
            let count = 0;
            for(let i = 0 ; i < members.length ; i ++) {
              User.findById(members[i], function (err, mem) {
                if(mem) {
                  let index = mem.MeetUpsList.map(function (o) {
                    return o.meetupsId.toString();
                  }).indexOf(meetupId);

                  if (mem.MeetUpsList[index].isEntered) {
                    trueCount ++;
                    membersLocation.push({lat: mem.Lat, lng: mem.Lng});
                  }
                  count ++;
                }
                
                if(trueCount === members.length){
                  console.log("모든 사용자가 입력하였습니다");
                  mu.isAllInputSet = true;

                  //********핫플레이스 계산하기********//
                  let memberLocationArr = [];
                  //멤버들의 위치를 2차원 배열로 저장 [[x, y], [x, y], ..]
                  for(let k = 0 ; k < membersLocation.length ; k ++){
                    let arr = [membersLocation[i].lat, membersLocation[i].lng];
                    memberLocationArr.push(arr);
                  }

                  //멤버들의 중간지점 계산 [x, y] 형식
                  let centerLocation = getCentroid(memberLocationArr);
                  //핫플레이스 중 가장 가까운 지점 저장
                  let place = getNearest(centerLocation, places);
                  
                  mu.Place = place;
                  //let closestStation = [0,0]
                  mu.save(function (e, d) {
                    if(d) {
                      res.status(200).json({place});
                    }
                  });
                } else if(count === members.length) {
                  res.status(200).json(data);
                }
              })
            }
          });
        }
      });
    }
  });
});

router.options('/meetups/setloca/:mId', cors(), function (req, res, next) {
  res.status(200).end();
});

module.exports = router;
