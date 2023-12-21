const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const config = require('./server/config/config')
app.set('superSecret', config.secret);
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const fs = require('fs');
var cors = require('cors')
app.use(cors())

var jwt = require('jsonwebtoken');

const logDir = path.join(__dirname, 'logs');

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'error', // Set your desired log level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new DailyRotateFile({
            level: 'error',
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m', // Rotate when log file reaches 20MB
            // maxFiles: '14d', // Keep logs for 14 days
        }),
        new winston.transports.Console(),
    ],
});

function logError(error) {
    logger.error({ message: error.message, stack: error.stack });
}


function JWTauthorization(req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    if (token) {
        const str = token;
        const arr = str.split(" ");

        jwt.verify(arr[1], app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: err });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'no token provided.'
        });
    }
    //  logger.info('Warning',new Date(), req.method, req.url, req.body,req.decoded);
    //  console.log(new Date(), req.method, req.url,'Token Status' + res.success);
}
var router = express.Router();

router.use(function (req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});


const auth = require('./server/routes/auth');

const roleapi = require('./server/routes/roleapi');

const profileapi = require('./server/routes/profileapi');

const employeeapi = require('./server/routes/employeeapi');

// const api = require('./server/routes/api');


app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: false
}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/auth', auth);

app.use('/roleapi',JWTauthorization,roleapi);

app.use('/profileapi',JWTauthorization,profileapi);

app.use('/employeeapi', JWTauthorization, employeeapi);

// app.use('/api',JWTauthorization,api);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

const port = process.env.PORT;
app.set('port', port);



if (process.env.PRODUCTION == 'false') {
    const server = http.createServer(app);
    server.listen(port, () => console.log(`API running on localhost:${port}`));
} else {
    // const httpsOptions = {
    //     cert: fs.readFileSync(process.env.CERTIFICATE),
    //     ca: fs.readFileSync(process.env.CA_BUNDLE),
    //     key: fs.readFileSync(process.env.PRIVATE_KEY),
    // }
    // const server = https.createServer(httpsOptions, app);
    // server.listen(port, () => console.log(`API running on localhost:${port}`));
}

app.use(function (err, req, res, next) {
    // winston.level = 'error';
    // logger.error('error', "Request URL : " + req.url, err.stack);
    logError(err);
    res.status(500).send({ success: false, ResultObj: req.resultObj, error: err.stack })
})
