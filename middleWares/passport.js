const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

//Đăng nhập bằng FB
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('./auth');

const personModel = require('../model/person.model');
// const bCrypt = require('bcrypt');
// const saltRounds = 10;
module.exports = function(passport) {

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });
    passport.deserializeUser(function(user, cb) {
        cb(null, user);
    });


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
                    FullName: user[0].FullName, 
                    Email: user[0].Email,
                    Avatar: user[0].Avatar
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

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['email', 'gender','locale', 'displayName']
    },
    // Facebook sẽ gửi lại chuối token và thông tin profile của user
    function (token, refreshToken, profile, cb) {
        console.log(profile);
        const user = {
            ID: 0,
            FullName: profile._json.name 
        }
        return cb(null, user);
    }));


    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function (token, refreshToken, profile, cb) {
        process.nextTick(function () {
            console.log(profile);

            const user = {
                ID: 0,
                FullName: profile.displayName
            }
            return cb(null, user);
        });
    }));

}