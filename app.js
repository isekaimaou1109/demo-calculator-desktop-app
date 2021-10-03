'use strict';
import { config } from 'dotenv';
config();
import https from 'https';
import fs from 'fs';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Server } from "socket.io";

import users from './routes/users';
import routes from './routes/index';
import login_route from './routes/login';
import register_route from './routes/register';
import dashboard_route from './routes/dashboard';
import api_route from './api/filesystem.js';

import { UserModel } from './models/Users.js';
import { LogsModel } from './models/Logs.js';

import { standardHeaderSetting, logWriter, preventLogin } from './utils.js';

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

export const app = express();
const httpsServer = https.createServer(options, app);
const csrfProtection = csurf({ cookie: true });
export const io = new Server(httpsServer, {
    cors: {
        origin: "*"
    }
});

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('debug', true);

//view engine setup
app.set('views', path.join(__dirname, 'views'));

/* standard header setting */
app.use(standardHeaderSetting);

/* apply cors */
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, 'public')));

app.use(logWriter);

/* routings */
app.use('/', routes);
app.use('/users', users);
app.use('/login', csrfProtection, login_route);
app.use('/register', csrfProtection, register_route);
app.use('/dashboard', function (req, res, next) {
    if (!req.cookies['__au__'] || !req.cookies['_k_']) {
        if (req.cookies['__au__']) {
            res.clearCookie('__au__');
        }

        if (req.cookies['_k_']) {
            res.clearCookie('_k_');
        }

        res.redirect(301, "/");
    } 

    if (req.cookies['__au__'] && req.cookies['_k_']) {
        jwt.verify(req.cookies['__au__'], req.cookies['_k_'], function (err, payload) {
            UserModel().findOne({ _id: payload.__p__ }, function (err, user) {
                if (!user || err) {
                    res.redirect(301, "/");
                }
                next();
            });
        });
    } 
}, dashboard_route);
app.use('/api', api_route);

io.on('wrong_login', function (isWrong, request) {
    if (isWrong && request.ip) {
        const log = new LogsModel();
        log.initialization(request.ip, request.protocol, request.method);
    }
});

//io.engine.on("initial_headers", (headers, req) => {
//    headers["test"] = "123";
//    headers["set-cookie"] = "mycookie=456";
//    console.log("headers init is " + JSON.stringify(headers, null, 2))
//});

//io.engine.on("headers", (headers, req) => {
//    console.log("after " + JSON.stringify(headers, null, 2))
//});

/* https port */
app.set('ports', process.env.PORT || 2337);

const httpsListening = httpsServer.listen(app.get('ports'), function () {
    console.log('Express server https listening on port ' + httpsListening.address().port);
});
