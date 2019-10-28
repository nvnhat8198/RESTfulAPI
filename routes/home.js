var express = require('express');
var router = express.Router();
var passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('API Game Caro');
});


//dang nhap facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
//callback
router.get('/auth/facebook/callback', passport.authenticate('facebook', {}),(req, res)=>{
  console.log('req.user', req.user);
  var user = req.user;
    req.login(user, {session: false}, (err) => {
      if (err) {
          res.send(err);
      }
      const token = jwt.sign(req.user, 'your_jwt_secret');
      return res.json({
        user, 
        token
      });
    });
  }
);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
// the callback after google has authenticated the user
router.get('/auth/google/callback', passport.authenticate('google', {}), (req, res)=>{
  var user = req.user;
  req.login(user, {session: false}, (err) => {
    if (err) {
        res.send(err);
    }
    const token = jwt.sign(req.user, 'your_jwt_secret');
    return res.json({
      user, 
      token
    });
  });

});


module.exports = router;