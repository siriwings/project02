const GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from './../models/user';
import jwt from 'jsonwebtoken';
import config from './../config';

export default new GoogleStrategy({
    clientID: '852161790312-qkaae5gb58291s15hfmlvnm7vhboodao.apps.googleusercontent.com',
    clientSecret: 'i9nW8vMRAW2smZ_Swwh9QwFf',
    callbackURL: '/auth/google/callback'
  //  profileFields: ['id', 'email', 'name', 'displayName'],

}, (accessToken, refreshToken, profile, done) => {
    console.log("google 호출됨");
    console.dir(profile);

    const userData = {
        email: profile.emails[0].value,
        provider: 'google',
        google: profile._json,
        name: profile.displayName,
    };

    return User.findOne({email: profile.emails[0].value}, (err, user) => {
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
                    name: user.name,
                    isLoggedIn: true,
                    token: token
                };
                return done(null, data);
            });
        }
    });
});