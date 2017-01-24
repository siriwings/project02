const PassportLocalStrategy = require('passport-local').Strategy;
import User from './../models/user';
import jwt from 'jsonwebtoken';
import config from './../config';

export default new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {
    const userData = {
        email: email.trim(),
        password: password.trim()
    };

    // find a user who doesn't have provider by email address
    return User.findOne({$and:[{email: userData.email},{provider:{$nin:["facebook","google"]}}]}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            const error = new Error('Incorrect email or password');
            error.name = 'IncorrectCredentialsError';

            return done(error);
        }

        // check if a hashed user's password is equal to a value saved in the database
        return user.comparePassword(userData.password, (passwordErr, isMatch) => {
            if (err) {
                return done(err);
            }

            if (!isMatch) {
                const error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';

                return done(error);
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
                isLoggedIn : true,
                token:token
            };

            //로그인 성공 시 token을 쿠키에 저장
            console.log("local-login 성공");
            return done(null,data);
        });

    });

});

