var express = require('express');
var router = express.Router();
var cors = require('cors');

const USERS = [
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
  console.log(req.body.user_friends);
  const newUser = {
    uid: ++id,
    user_fbid: req.body.user_fbid,
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_friends: req.body.user_friends
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

router.options('/user/:id', cors(), function (req, res, next){
  res.status(200).end();
})

module.exports = router;
