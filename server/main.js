import express from 'express';
import path from 'path';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import cookieParser from 'cookie-parser';
import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY

import mongoose from 'mongoose';
import session from 'express-session';
import cookieSession from 'cookie-session';

import config from './config';

//passport 관련 import
import passport from 'passport';
import localSignupStrategy from './passport/local-signup';
import localLoginStrategy from './passport/local-login';
import facebookLoginStrategy from './passport/facebook';
import googleLoginStrategy from './passport/google';

//api로 들어오는 모든 요청에 auth-check적용
//import authCheckMiddleware from './middleware/auth-check';

//export한 route폴더의 index.js
import api from './routes';
import authRoutes from './routes/auth';
//import mainRoutes from './routes/home';

const app = express();
const port = 3000;
const devPort = 4000;

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader("Access-Control-Max-Age", "3600");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(morgan('dev'));
app.use(bodyParser.json());

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
/*
app.use(session({
    secret: 'enter secret key'
    , resave: false
    , saveUninitialized: false
}));
*/
app.use(cookieSession({
    keys: ['node_siri'],
    httpOnly:false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 유효기간 1시간
    }
}));

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    console.log("serializeUser() 호출됨.");
    console.dir(user);

    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("deserializeUser() 호출됨.");
    console.dir(user);

    done(null, user);
});
// load passport strategies
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
passport.use('facebook',facebookLoginStrategy);
passport.use('google',googleLoginStrategy);

/* mongodb connection */
mongoose.connect(config.mongodbUri);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongodb server');
});

/*
app.all('*',function(req,res,next){

    if (!req.get('Origin')){
        return next();
    }
    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
    if ('OPTIONS' == req.method){
        return res.send(200);
    }
    next();
});
*/

app.use('/', express.static(path.join(__dirname, './../public')));

//app.use('/home',mainRoutes);

// pass the authenticaion checker middleware
//app.use('/api', authCheckMiddleware);

/* setup routers & static directory */
//import api from './routes';
app.use('/api', api);


/*
 *  /auth/login 과 같이 접근하게 하기 위해서...
 */
app.use('/auth', authRoutes);

/* support client-side routing */
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});


/* handle error */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
