'use strict';
import express from 'express';
import ReactDOMServer from "react-dom/server"
import React from 'react';
import { StaticRouter } from "react-router-dom";

import { wrapper } from '../utils.js';
import { Dashboard } from '../fe/dashboard.js';
var router = express.Router();

/* GET login page. */
router.get('/:id', function (req, res) {
    var id;
    console.log("Id get here now! " + req.url);
    if (req.params.id) {
        id = req.params.id;
    } else {
        res.redirect(301, "/");
    }

    const staticContext = {
        location: `/dashboard${req.url}`,
        token: id
    };

    /*res.status(200).send(wrapper("Dashboard", html));*/
    res.status(200).send(wrapper("Dashboard", "", "<script src='/static/javascripts/dashboard_bundled.js'></script>", `
        <script src ="/static/javascripts/react/react.development.js"></script>
        <script src="/static/javascripts/react/react-dom.development.js"></script>    
    `, `
        <link rel="stylesheet" href="/static/stylesheets/main.css">
    `));
});

export default router;