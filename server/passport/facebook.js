const PassportFacebookStrategy = require('passport-facebook').Strategy;
import User from './../models/user';
import jwt from 'jsonwebtoken';
import config from './../config';

export default new PassportFacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id','email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
    console.log("passport의 facebook 호출됨");
   // console.dir(profile);

    const userData = {
        id:profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        provider:"facebook"
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