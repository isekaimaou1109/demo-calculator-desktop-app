//var bodyParser = require('body-parser');
//var express = require('express');
//var mongoose = require('mongoose');
//var OAuthServer = require('express-oauth-server');

//var app = express();

//mongoose.connect('mongodb://localhost:27017/test');

//app.oauth = new OAuthServer({
//    debug: true,
//    model: require('./model.js'),
//    // See https://github.com/oauthjs/node-oauth2-server for specification
//});

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(app.oauth.authorize());

//app.use(function (req, res) {
//    res.send('Secret area');
//});

//app.listen(3000, () => console.log('listening'));


var { PythonShell } = require('python-shell');

let options = {
    mode: 'text',
    pythonPath: 'C:\\Users\\Administrator\\AppData\\Local\\Programs\\Python\\Python38\\python.exe',
    scriptPath: 'C:\\Users\\Administrator\\source\\repos\\server',
    args: ['-f', 'D:/user_storage/u2/data.txt']
};

PythonShell.run('storage_operations.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    const regexp = /[A-Z]+\\{2}\w+\:\((\w+\s*)*\:\)/gm

    results.forEach(item => console.log(item))
});