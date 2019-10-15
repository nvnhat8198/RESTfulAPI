const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const personModel = require('../model/person.model');
// const bCrypt = require('bcrypt');
// const saltRounds = 10;
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
            // if(!bCrypt.compareSync(Password, user[0].Password)){
            if(Password != user[0].Password){
                return cb(null, false, {message: 'Mật khẩu không đúng!'});
            }
            const payload = {
                ID: user[0].ID,
                FullName: user[0].FullName 
            }
            return cb(null, payload, {message: 'Đăng nhập thành công'});
        }).catch(err=>{
            console.log(err)
            return cb(err);
        })
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwt_payload, cb) {
        personModel.getPersonWithID(jwt_payload.ID).then(user=>{
            return cb(null,user);
        }).catch(err=>{
            return cb(err);
        })
    }
));
}