"use strict";
const express = require("express");
const helmet = require("helmet");
const app = express();
const busboy = require("connect-busboy");
const scribe = require("scribe-js")();
const console = process.console;
const storage = require("node-persist");
const UserDcs = require("./_MongoDB/models/userdcs");

app.use(helmet());

//MongoDB
const mongoose = require("mongoose");

mongoose.connect("mongodb://RomainHori:Dealtis25-@localhost:27017/Horizon");

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
    Romain.save(function(err) {
        if (err) throw err;

        console.log("User saved successfully");
        res.json({
            success: true
        });
    });
});

app.use(busboy());

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    if ("OPTIONS" == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

//Token Security for api
router.use(function(req, res, next) {
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
                }else {
                    user.nbRequest = 1;
                }
                user.save((err)=> {
                    if (err) throw err;
                });
            }else {
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
      console.tag({
          msg: "STORAGEPOS | UP",
          colors: ["italic", "grey", "bold"]
      }).time().file().info("Storage up");
  }).catch(e => {
      console.tag({
          msg: "STORAGEPOS | DOWN",
          colors: ["italic", "red", "bold"]
      }).time().file().error(e);
  });

require("./organisms/getPosition")(router, console, storePos);
require("./organisms/apiStore")(router, console, storePos);
require("./organisms/apiMongo")(router);
require("./molecules/getSalarie")(router, console);
require("./molecules/requestToken")(router, console);
require("./molecules/getZone")(router, console);
require("./molecules/getZones")(router, console);
require("./molecules/getEvents")(router, console);
require("./molecules/postImage")(router, console);
require("./molecules/getIcoEvents")(router, console);
require("./molecules/postEvent")(router, console, storePos);
require("./organisms/getInfoGroupage")(router, console);
require("./molecules/createChargement")(router, console);
require("./molecules/createConfig")(router, console);
require("./molecules/getConfig")(router, console);
require("./molecules/chargementExist")(router);
require("./molecules/userInChargement")(router);

require("./molecules/getLastPosDms")(router);
require("./molecules/getLastPosDmsFromSoc")(router);



require("./molecules/clotureChargement")(router,console, io);
require("./molecules/logoutSalarie")(router,console, io);

require("./organisms/socket")(io,console, storePos);

app.use("/api", router);
app.listen(port);

app.use("/logs", scribe.webPanel());
app.use(scribe.express.logger());

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

console.tag({
    msg: "START",
    colors: ["italic", "green", "bold"]
}).time().file().info(`Magic happens on port ${port}`);

// const startMail = require("./mail/startMail");
// const sendMail = require("./mail/nodemailer");
//
// sendMail(startMail)
// .then(res => {
//     console.log(res.accepted);
// })
// .catch(err =>{
//     console.log(err);
// });
