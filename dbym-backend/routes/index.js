var express = require('express');
var router = express.Router();
var cors = require('cors');

const USERS = [
];

const MEETUPS = [
];

let id = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', cors(), function (req, res, next) {
  res.json({
    users: USERS
  });
});

router.post('/user', cors(), function (req, res, next) {
  const newUser = {
    uid: ++id,
    userFbid: req.body.userFbid,
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userFriends: req.body.userFriends
  };

  USERS.push(newUser);

  res.json(newUser);
});

router.options('/user', cors(), function (req, res, next) {
  res.status(200).end();
});

router.options('/user', cors(), function (req, res, next) {
  res.status(200).end();
});

router.put('/user/:id', cors(), function (req, res, next) {
  // code goes here..
  if (USERS[req.params.id].completed) {
    USERS[req.params.id].completed = false;
  }else{
    USERS[req.params.id].completed = true;
  }
  res.status(200).end();
});

router.get('/user:id', cors(), function (req, res, next){
  res.json({
    user: USERS[0]
  })
});

router.options('/user/:id', cors(), function (req, res, next){
  res.status(200).end();
});

router.get('/meetups', cors(), function (req, res, next) {
  res.json({
    meetups: MEETUPS
  });
});

router.post('/meetup', cors(), function (req, res, next) {
  const newMeetUp = {
    hostId: req.body.hostId,
    hotPlaces: req.body.hotPlaces,
    guests: req.body.guests,
    category: req.body.category,
    myLoctation: req.body.myLoctation
  };

  MEETUPS.push(newMeetUp);

  res.json(newMeetUp);
});

router.options('/meetup', cors(), function (req, res, next) {
  res.status(200).end();
});

module.exports = router;
