import express from 'express';
import validator from 'validator';
import passport from 'passport';

const router = new express.Router();

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a correct email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must have at least 8 characters.';
    }

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Please provide your email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

router.post('/signup', (req, res, next) => {
    const validationResult = validateSignupForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    return passport.authenticate('local-signup', (err) => {
        if (err) {
            if (err.name === 'IncorrectCredentialsError') {
                // the 11000 Mongo code is for a duplication email error
                // the 409 HTTP status code is for conflict error
                return res.status(409).json({
                    success: false,
                    message: err.message,
                    errors: {
                        email: 'This email is already taken.'
                    }
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Could not process the form.',
                errors: {
                    email: '',
                    password: ''
                }
            });
        }

        return res.status(200).json({
            success: true
        });
    })(req, res, next);
});

/*
다하고 오류 처리할 것 : 성공시 반환 값은 여기서 주면 되지만, 오류처리는 local-login에서 해줘야할 듯...
 */
router.post('/login', passport.authenticate('local-login')
    , (req, res) => {
        //console.log("login 파트임...");
        //console.log(req.session);
        res.json({
            success: true
           , info: req.session.passport.user
        });
    });

/*
 GET CURRENT USER INFO GET /auth/getinfo
 */
router.get('/getinfo', (req, res) => {
    console.log("getinfo 파트임...");
    //console.log(req.session);
    //console.log(req.session.passport.user);

    if(typeof req.session.passport.user.name === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.passport.user });
});

/*
 LOGOUT: get /auth/logout
 */
router.get('/logout', (req, res) => {
    //req.session.destroy(err => { if(err) throw err; });
    req.session=null;
    return res.json({ success: true });
});


/*facebook Login*/
router.get('/facebook', passport.authenticate('facebook')
    ,(req,res)=>{
    console.log("FBlogin 파트임...111");
});

router.get('/facebook/callback', passport.authenticate('facebook')
    , (req, res) => {
        console.log("FBlogin 파트임...222");
        console.log(req.session);
        res.json({
            success: true
            , info: req.session.passport.user
        });
    });


export default router;
