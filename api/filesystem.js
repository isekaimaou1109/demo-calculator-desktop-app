import fs from 'fs';
import { spawn } from 'child_process';
import express from 'express';
import jwt from 'jsonwebtoken';
import { PythonShell } from 'python-shell';

const router = express();

//router.use(function (req, res, next) {
//    if (req.headers['Authorization']) {
//        let extract = req.headers['Authorization'].split('Bearer ').join('');

//    }
//});

router.post('/create_folder', function (req, res) {
    
});

router.post('/upload', function (req, res) {

});

router.get('/share', function (req, res) {
    //let options = {
    //    mode: 'text',
    //    pythonPath: 'C:\\Program Files (x86)\\Python38-32\\python.exe'
    //};

    //PythonShell.run(`storage_operations.py -f ${'D:\\user_storage\\u2'}`, options, function (err, results) {
    //    if (err) throw err;
    //    // results is an array consisting of messages collected during execution
    //    console.log('results: %j', results);
    //    res.send(results);
    //});

    let runner = spawn(`storage_operations.py`, ['-f', 'D:\\user_storage\\u2'], {
        
    });

    runner.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        res.send(data)
    });
});

router.post('/list', function (req, res) {
    
});

export default router;
