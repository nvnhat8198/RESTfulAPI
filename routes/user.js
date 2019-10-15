var express = require('express');
var router = express.Router();
const personModel = require('../model/person.model');

const passport = require('passport');
// const bCrypt = require('bcrypt');
// const saltRounds = 10;
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next){
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
        return res.status(400).json({
            message: 'Something is not right',
            user   : user
        });
    }
   req.login(user, {session: false}, (err) => {
       if (err) {
           res.send(err);
       }
       const token = jwt.sign(user, 'your_jwt_secret');
       return res.json({user, token});
    });
  })(req, res);
});

router.post('/register', function(req, res, next){
    var FullName = req.body.FullName;
    var Email = req.body.Email;
    // var Password = bCrypt.hashSync(req.body.Password, bCrypt.genSaltSync(saltRounds));
    var Password = req.body.Password;
    personModel.getPersonWithEmail(Email).then(r=>{
      if(r.length){
        res.send('Email đã tồn tại, đăng kí không thành công!');
      }
      else{
        personModel.addPerson(FullName, Email, Password).then(r=>{
          res.send('Đăng kí thành công!');
        }).catch(err=>{
          res.send(err);
        })
      }
    }).catch(err=>{
      res.send(err);
    })
    
});

module.exports = router;
