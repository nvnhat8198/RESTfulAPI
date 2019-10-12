const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const personModel = require('../model/person.model');
const bCrypt = require('bcrypt');
const saltRounds = 10;
module.exports = function(passport) {

passport.use('local', new LocalStrategy({
        usernameField: 'Email',
        passwordField: 'Password'
    },
    function (Email, Password, cb) {
        return personModel.getPersonWithEmail(Email).then(user=>{
            if(!user.length){
                return cb(null, false, {message: 'Email không tồn tại!'});
            }
            if(!bCrypt.compareSync(Password, user[0].Password)){
                return cb(null, false, {message: 'Mật khẩu không đúng!'});
            }  
            return cb(null, user[0], {message: 'Đăng nhập thành công'});
        }).catch(err=>{
            console.log(err)
            return cb(err);
        })
    }
));

passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwtPayload, cb) {
        personModel.getPersonWithID(jwtPayload.ID).then(r=>{
            return cb(null,user);
        }).catch(err=>{
            return cb(err);
        })
    }
));
}