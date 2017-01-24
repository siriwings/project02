const PassportFacebookStrategy = require('passport-facebook').Strategy;
import User from './../models/user';
import jwt from 'jsonwebtoken';
import config from './../config';

export default new PassportFacebookStrategy({
    //clientID: config.clientID,
    //callbackURL: config.callbackURL,

    clientID: '1821274114796832',
    clientSecret: '7dd265a56e3b91caaffbabfb4fa75c83',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'email', 'name', 'displayName'],

}, (accessToken, refreshToken, profile, done) => {
    console.log("passport의 facebook 호출됨");
    console.dir(profile);

    const userData = {
        email: profile.emails[0].value,
        provider: 'facebook',
        facebook: profile._json,
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

