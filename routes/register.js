'use strict';
import express from 'express';
import ReactDOMServer from "react-dom/server"
import React from 'react';
import { StaticRouter } from "react-router-dom";

import { wrapper } from '../utils.js';
import { Register } from '../fe/register.js';
import { UserModel } from '../models/Users.js';


var router = express.Router();

/* GET register page. */
router.get('/', function (req, res) {
    const staticContext = {
        csrfToken: req.csrfToken()
    }

    let html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={staticContext}>
            <Register staticContext={staticContext} />
        </StaticRouter>
    );

    res.status(200).send(wrapper("Register", html)); 
});

router.post('/', function (req, res) {
    const {
        username, password, email, lastname, firstname
    } = req.body;

    const doc = new UserModel()({
        firstname: firstname,
        lastname: lastname,
        email: email,
        username: username,
        keys: {}
    });

    doc.setPassword(password);

    doc.save()

    res.redirect(301, "/");
});

export default router;
