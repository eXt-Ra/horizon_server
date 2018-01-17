"use strict";
const express = require("express");
const helmet = require("helmet");
const app = express();
const busboy = require("connect-busboy");
const bodyParser = require('body-parser');
const storage = require("node-persist");
const UserDcs = require("./_MongoDB/models/userdcs");
app.use(helmet());

const startMail = require("./mail/startMail");
const errorMail = require("./mail/ErrorMail");
const sendMail = require("./mail/nodemailer");
const logger = require("./organisms/logger");

require("./connmongo")();

//MongoDB
const mongoose = require("mongoose");

// Use native promises
mongoose.Promise = Promise;

//Model
const UserApi = require("./_MongoDB/models/userapi");

//Port Websocket
const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8081);

const port = process.env.PORT || 8080;
const router = express.Router();

app.get("/setup", (req, res) => {
    var Romain = new UserApi({
        name: "romain",
        token: "w25K}54dkaE/[dgduVqcX9VicQF17u",
        societe: "MJU39",
        active: true,
        type: "admin"
    });
    Romain.save(function (err) {
        if (err) throw err;

        logger.log("User saved successfully");
        res.json({
            success: true
        });
    });
});

app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    if ("OPTIONS" == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

//Token Security for api
router.use(function (req, res, next) {
    UserApi.findOne({
        token: req.headers["x-access-token"]
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(403).send({
                success: false,
                message: "No token provided."
            });
        } else if (user) {
            if (user.active) {
                // console.tag({
                //     msg: "TOKEN",
                //     colors: ["italic", "bgGreen", "bold"]
                // }).time().file().info(`request ${user.token}`);
                next();
                if (user.nbRequest != undefined) {
                    user.nbRequest = user.nbRequest + 1;
                } else {
                    user.nbRequest = 1;
                }
                user.save((err) => {
                    if (err) throw err;
                });
            } else {
                return res.status(403).send("Utilisateur non actif");
            }
        }
    });
});

//Store position Andsoft
const storePos = storage.create({
    dir: "storePos",
    ttl: true,
    expiredInterval: 2 * 60 * 1000
});

storePos.init()
    .then(() => {
        logger.DCS_Console.info("[STORAGEPOS | UP]", "Storage up");
    }).catch(e => {
    logger.DCS_Console.error("[STORAGEPOS | DOWN]", e);
    sendMail(errorMail(e))
        .then(res => {
            console.log(res.accepted);
        })
        .catch(err => {
            console.log(err);
        });
});

require("./organisms/getPosition")(router, logger.DCS_Positions, storePos);
require("./molecules/postPosition")(io, router, logger.DCS_Positions, storePos);
require("./organisms/apiStore")(router, logger.DCS_Console, storePos);
require("./organisms/apiMongo")(router);
require("./molecules/getSalarie")(router, logger.DCS_Salarie);
require("./molecules/logoutSalarie")(router, logger.DCS_Salarie, io);
require("./molecules/requestToken")(router, logger.DCS_Console);
require("./molecules/getEvents")(router);
require("./molecules/postImage")(router, logger.DCS_Image);
require("./molecules/getIcoEvents")(router, logger.DCS_Event);
require("./molecules/postEvent")(router, logger.DCS_Event, storePos);

require("./organisms/getInfoGroupage")(router);
require("./organisms/getPosGroupage")(router);

require("./molecules/createChargement")(router, logger.DCS_Positions);
require("./molecules/clotureChargement")(router, logger.DCS_Positions, io);

require("./molecules/chargementExist")(router);
require("./molecules/userInChargement")(router);

require("./molecules/createConfigDCS")(router, logger.DCS_Console);
require("./molecules/getConfigDCS")(router, logger.DCS_Console);

//COPY
require("./molecules/copyConfigToConfigDcs")(router, logger.DCS_Console);

require("./molecules/getZone")(router);
require("./molecules/getZones")(router, logger.DCS_Console);

require("./molecules/getLastPosDms")(router);
require("./molecules/getLastPosDmsFromSoc")(router);

require("./organisms/socket")(io, logger.DCS_Socket, storePos);
require("./organisms/logAPI")(io, logger);

require("./molecules/resendEventDay")(router, storePos);

require("./molecules/requestDcsLastVersion")(router, logger.DCS_Console);

app.use("/dashboard_dcs", express.static("dashboard/dcs"));
app.use("/dms_api", express.static("doc/build"));
app.get("/apk/dcs-apk/", (req, res) => {
    console.log("dl last version");
    const file = __dirname + '/apk/dcs.apk';
    res.download(file);
});
app.use("/api", router);
app.listen(port);

//disconnect all user
UserDcs.find({}, (err, users) => {
    if (err) throw err;
    users.forEach(user => {
        user.connected = false;
        user.save((err) => {
            if (err) throw err;
        });
    });
});


logger.DCS_Console.info(`[START] Magic happens on port ${port}`);

// sendMail(startMail)
//     .then(res => {
//         console.log(res.accepted);
//     })
//     .catch(err => {
//         console.log(err);
//     });
