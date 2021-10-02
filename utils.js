import { io } from './app.js';
import { LogsModel } from './models/Logs.js';
import nodemailer from "nodemailer";

export const wrapper = function (title = "", content = "", scripts = null, extraScripts = null, css = null) {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${title}</title>
                ${
                    css ? css : ""
                }
                <link rel="stylesheet" href="/static/stylesheets/global.css">
            </head>

            <body>
                <div id="app">
                    ${
                        !content ? "" : content
                    }
                </div>
                <script src="/socket.io/socket.io.js"></script>
                <script src="/static/javascripts/__s__.js"></script>
                ${
                    !extraScripts ? "" : extraScripts
                }
                ${
                    scripts ? scripts : ""
                }
            </body>
        <html>
    `
}

export function logWriter(req, res, next) {
    let currentLog = new LogsModel();
    currentLog.initialization(req.ip, req.protocol, req.method);

    var realPath = req.path;

    io.on("connection", function (socket) {
        console.log("socket is " + socket.connected)

        socket.on("exchange", function (data) {
            console.log("exchange event has received this data from client " + JSON.stringify(data, null, 2))
        });

        socket.on('geometry', function (location) {
            if (location === realPath) {
                currentLog['path'] = location;
                currentLog.save();
            }
        });
    });

    next();
};

export function standardHeaderSetting(req, res, next) {
    /* remove x-power-by: express */
    res.removeHeader('X-Powered-By');

    /* protect from xss attack from IE */
    res.setHeader("X-XSS-Protection", "0");

    /* prevent clickhjacking attack by set frame options */
    res.setHeader("X-Frame-Options", "deny");

    /* prevent sniff mimetypes */
    res.setHeader("X-Content-Type-Options", "nosniff");

    /* if user request http (not force) but the next request will use https */
    res.setHeader("Strict-Transport-Security", "max-age=31536000 ; includeSubDomains");


    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

    /* know the site previously i was in */
    res.setHeader('Referrer-Policy', 'no-referrer');

    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", 'same-origin');
    res.setHeader("Cross-Origin-Resource-Policy", 'same-origin');

    res.setHeader('Content-Security-Policy', "default-src 'self'; object-src 'none'; child-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content");

    /* clear cache */
    res.setHeader("Surrogate-Control", "no-store");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    next();
};

export function preventLogin(req, res, next) {
    if (!req.cookies['__au__']) {
        next();
    } else {
        io.emit("deny_access", "You cannot access this route because you're logged in!!");
        res.redirect(301, "/");
    }
};

export async function sendGmail(to) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_ACCOUNT, // generated ethereal user
            pass: process.env.GMAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "Isekai Administrator <isekaimaou1109@gmail.com>", // sender address
        to: to, // list of receivers
        subject: 'Welcome and congratulation', // Subject line
        text: 'Please check this mail to complete your account registered!', // plain text body
        html: `
            <h1 style="text-align:center;color:red;font-size:36px;">Welcome and Congratulation to Our Services</h1>
            <p style="font-style:italic;font-weight:bold;">${to.split('@gmail.com').join('')}</p>
            <p style="font-weight:bold;line-height:2;font-size:16px;">
            You should click this link below to authentication your account that you have registered before. Note that, this link just exist in 15 minutes around. Please pleasure to use our services!!
            </p>
            <span style="font-size:16px;font-weight:bold;">Link: </span>
            <a href="#" style="font-size:16px;">https://localhost:2337/</a>
            <h3 style="text-align:end;">From isekaimaou1109</h3>
            <img src="https://i.ibb.co/dgRjVcp/d-i-m.jpg" width=64 height=64 style="float:right;margin-right:50px;"/>
        `, // html body
    });

    return info.messageId;
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
