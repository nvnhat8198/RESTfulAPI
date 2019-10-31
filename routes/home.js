var express = require('express');
var router = express.Router();
var passport = require('passport');
const jwt = require('jsonwebtoken');

const personModel = require('../model/person.model');
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


router.post('/changepassword', function(req, res, next){
  var ID = req.body.ID;
  var curPass = req.body.CurPassword;
  var newPass = req.body.NewPassword;
  personModel.getPersonWithID(ID).then(user=>{
    if(!user.length){
      res.send('Tài khoản không tồn tại!');
    }
    else{
      console.log(user[0]);
      if(curPass!=user[0].Password){
        res.send('Mật khẩu hiện tại nhập không đúng');
      }
      else{
        personModel.updatePasswordWithID(ID,newPass);
        res.send('Đổi mật khẩu thành công!');
      }
    }
  }).catch(err=>{
    console.log(err);
  })
})


router.post('/changeinfo', function(req, res, next){
  var ID = req.body.ID;
  var FullName = req.body.FullName;
  var Email = req.body.Email;
  personModel.getPersonWithID(ID).then(user=>{
    if(!user.length){
      res.send('Tài khoản không tồn tại!');
    }
    else{
      personModel.getPersonWithEmail(Email).then(r=>{
        if(r.length && user[0].ID != r[0].ID){
          res.send('Email vừa nhập đã tồn tại!');
        }
        else{
          personModel.updateEmailAndFullNameWithID(ID, Email, FullName);
          res.send('Cập nhật thông tin thành công!');
        }
      })
    }
  }).catch(err=>{
    console.log(err);
  })
})


router.post('/changeavatar', function(req, res, next){
  var ID = req.body.ID;
  var Avatar = req.body.Avatar;
  personModel.getPersonWithID(ID).then(user=>{
    if(!user.length){
      res.send('Tài khoản không tồn tại!');
    }
    else{
      personModel.updateAvatarWithID(ID, Avatar);
      res.send('Đổi Avatar thành công!');
    }
  }).catch(err=>{
    console.log(err);
  })
})



module.exports = router;