const GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from './../models/user';
import jwt from 'jsonwebtoken';
import config from './../config';

export default new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true

}, (req,accessToken, refreshToken, profile, done) => {

    console.log("google 호출됨");
    //console.dir(profile);

    const userData = {
        id: profile.id, //To prevent duplicated data setting
        email: profile.emails[0].value,
        name: profile.displayName,
        provider:"google"
    };

    return User.findOne({id: profile.id}, (err, user) => {
        if (user) {
            const payload = {
                sub: user._id
            };

            // create a token string
            const token = jwt.sign(payload, config.secret, {
                    expiresIn: '10h'
                }
            );
            const data = {
                name: profile.displayName,
                isLoggedIn: true,
                token: token
            };
            return done(null, data);
        } else {
            const user = new User(userData);
            user.save((err) => {
                if (err) {
                    return done(err);
                }

                const payload = {
                    sub: user._id
                };

                // create a token string
                const token = jwt.sign(payload, config.secret, {
                        expiresIn: '10h'
                    }
                );
                const data = {
                    name: profile.displayName,
                    isLoggedIn: true,
                    token: token
                };
                return done(null, data);
            });
        }
    });
});