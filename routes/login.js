'use strict';
import express from 'express';
import ReactDOMServer from "react-dom/server"
import React from 'react';
import { StaticRouter } from "react-router-dom";
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import jwt from 'jsonwebtoken';

import { wrapper } from '../utils.js';
import { Login } from '../fe/login.js';
import { UserModel } from '../models/Users.js';
import { LogsModel } from '../models/Logs.js';
import { io } from '../app.js';

var router = express.Router();

router.use(passport.initialize());

/* local login */
var middleware = function (req, res, next) {
    UserModel().findOne({ username: req.body.username }, function (err, user) {
        console.log("this is a user from " + JSON.stringify(user))

        if (!user || err) {
            res.redirect(301, "/");
            //let count = loginLog.wrongAuthCount();
            //var downtime = count * 60 * 1000;
            //var state = false;

            //while (!state) {
            //    var countdown = setTimeout(function () {
            //        clearTimeout(countdown);
            //        res.redirect(301, "/login");
            //        state = true;
            //    }, downtime);

            //    if (req.method === 'POST' || req.method === 'GET' && (req.body && req.body.username && req.body.password)) {
            //        io.emit('duration_block', true);
            //    }
            //}
        }

        if (user.validatePassword(req.body.password)) {
            var secretKey = user.keys.get("secretKey")

            var token = jwt.sign({ __p__: user._id }, secretKey, { expiresIn: 60 * 60 });
            console.log("token is " + JSON.stringify(token))

            res.locals.token = token

            next();
        }
    });
};

/* fb login */
passport.use(new FacebookStrategy.Strategy({
    clientID: "336305764808892",
    clientSecret: "5a49bd9a980ecc882f8b090eeb830e39",
    callbackURL: "http://localhost:1337/login/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        UserModel().findOne({ _id: profile.id }, function (err, user) {
            if (err) console.error(err)

            if (!user) {
                const doc = new UserModel()();

                console.log("profile is " + JSON.stringify(profile, null, 2));

                doc.firstname = profile.name.givenName;
                doc.lastname = profile.name.familyName;
                doc.username = profile.name.givenName;
                doc.password = doc.setPassword("Nhat1234!");
                doc.email = "Nhat1234@gmail.com"

                doc.save()

                return done(null, user);
            }

            return done(null, false)
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserModel().findById(id, function (err, user) {
        done(err, user);
    });
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

/* GET login page. */
router.get('/', function (req, res) {
    const staticContext = {
        csrfToken: req.csrfToken()
    }

    let html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={staticContext}>
            <Login staticContext={staticContext} />
        </StaticRouter>
    );

    res.status(200).send(wrapper("Login", html)); 
});

router.post('/', middleware, function (req, res) {
    if (res.locals.token) {
        res.cookie('__au__', res.locals.token, {
            expires: 0,
            secure: true
        });

        res.setHeader('Authorization', `Bearer ${res.locals.token}`)
        res.redirect(301, `/dashboard/${res.locals.token}`);
    }
});

export default router;