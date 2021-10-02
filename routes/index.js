'use strict';
import express from 'express';
import ReactDOMServer from "react-dom/server"
import React from 'react';
import App, { RouteStatus } from '../fe/app.js'
import { StaticRouter } from "react-router-dom";
import { wrapper } from '../utils.js';

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    const staticContext = {}

    let html = ReactDOMServer.renderToString(
         <StaticRouter location={req.url} context={staticContext}>
             <App />
         </StaticRouter>
    );

    res.status(200).send(wrapper("Home", html));
});

export default router;
