"use strict";
const express = require("express");
const helmet = require("helmet");
const app = express();
const busboy = require("connect-busboy");
const scribe = require("scribe-js")();
const console = process.console;
const storage = require("node-persist");

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
        name: "Romain",
        token: "w25K}54dkaE/[dgduVqcX9VicQF17u",
        societe: "STJ25"
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
            next();
        }
    });
});

//Store position Andsoft
const storePos = storage.create({
    dir: "storePos",
    ttl: true
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

require("./organisms/socket")(io,console, storePos);

app.use("/api", router);
app.listen(port);

app.use("/logs", scribe.webPanel());
app.use(scribe.express.logger());

console.tag({
    msg: "START",
    colors: ["italic", "green", "bold"]
}).time().file().info(`Magic happens on port ${port}`);
