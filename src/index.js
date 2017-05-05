"use strict";
const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(helmet());
const busboy = require("connect-busboy");
const scribe = require("scribe-js")();
const console = process.console;
const storage = require("node-persist");
const moment = require("moment");

//MongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Horizon");

// Use native promises
mongoose.Promise = Promise;

//Model
const UserApi = require("./_MongoDB/models/userapi");
const UserDcs = require("./_MongoDB/models/userdcs");
const Chargement = require("./_MongoDB/models/chargement");

//PORT WEBSOCKET
var server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8081);

const port = process.env.PORT || 8080;
const router = express.Router();

app.get("/setup", (req, res) => {
    var nick = new UserApi({
        name: "Romain",
        token: "w25K}54dkaE/[dgduVqcX9VicQF17u",
        societe: "STJ25"
    });
    nick.save(function(err) {
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
  // res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    if ("OPTIONS" == req.method) {
        res.send(200);
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
require("./molecules/postEvent")(router, console);
require("./organisms/getInfoGroupage")(router, console);
require("./molecules/createChargement")(router, console);
require("./molecules/chargementExist")(router);
require("./molecules/userInChargement")(router);

app.use("/api", router);
app.listen(port);

app.use("/logs", scribe.webPanel());

console.tag({
    msg: "START",
    colors: ["italic", "green", "bold"]
}).time().file().info(`Magic happens on port ${port}`);

//SOCKET
io.on("connection", function(socket) {
    console.tag("SOCKET").time().file().info(`Connect! ${socket.id}`);

    socket.on("handshake", handshake => {
        if (handshake.plateforme == "smartphone") {
            UserDcs.findOne({
                code: handshake.user
            }, (err, user) => {
                user.socketId = socket.id;
                console.tag("SOCKET").time().file().info(`USER : ${handshake.user} CONN`);
                socket.join("smart");
                io.to("desktop").emit("newSmart", user);
                user.save((err) => {
                    if (err) throw err;
                });
            });
        } else {
            socket.join("desktop");
            UserDcs.find({}, function(err, users) {
                if (err) throw err;
                socket.emit("listSmart", users);
            });
        }
    });

    socket.on("closeHandShake", user => {
        console.tag("SOCKET").time().file().info(`closeHandShake ${socket.id}`);
        UserDcs.findOne({
            code: user
        }, (err, user) => {
            if (err) throw err;
            user.connected = false;
            console.tag("SOCKET").time().file().info(`USER : ${user.code} DISCONN`);
            io.to("desktop").emit("suppSmart", user.code);
            user.save((err) => {
                if (err) throw err;
            });
        });
    });

    socket.on("joinChargement", (token, user) => {
        socket.join(token);
        Chargement.findOne({
            token: token
        }).then(charg => {
            if (charg != null) {
                charg.logs.push({
                    type: "conn",
                    user: user,
                    date: moment().format()
                });
                charg.users.push({
                    user: user,
                    date: moment().format()
                });
                charg.save(function(err) {
                    if (err) throw err;
                    socket.emit("joinChargement_Notif");
                    console.tag("SOCKET").time().file().info(`joinChargement ${token} / ${user}`);
                });
            }
        }).catch(err => {
            if (err) throw err;
        });
    });

    socket.on("leaveChargement", (token, user) => {
        socket.leave(token);
        Chargement.findOne({
            token: token
        }).then(charg => {
            if (charg != null) {
                charg.logs.push({
                    type: "leave",
                    user: user,
                    date: moment().format()
                });
                Chargement.update(
                  {token: token},
                  { $pull: {users : {user: user}}},
                    function (err,val) {
                        console.log(val);
                    });
                socket.emit("leaveChargement_Notif");
                console.tag("SOCKET").time().file().info(`leaveChargement ${token} / ${user}`);
            }
        }).catch(err => {
            if (err) throw err;
        });
    });

    socket.on("CHA.addPos", (token, numpos, user) => {
        Chargement.findOne({
            token: token
        }).then(charg => {
            if (charg != null) {
                storePos.getItem(numpos).then(pos => {
                    charg.positions.push(pos);
                    charg.logs.push({
                        type: "addPos",
                        user: user,
                        date: moment().format()
                    });
                    charg.save(function(err) {
                        if (err) throw err;
                        console.tag("SOCKET").time().file().info(`CHA.addPos UPDATE ${token} / ${numpos} / ${user}`);
                    });
                    socket.broadcast.to(token).emit("CHA.addPos_Notif", numpos);
                });
            }
        }).catch(err => {
            if (err) throw err;
        });
    });

    socket.on("CHA.deletePos", (token, index, user) => {
        Chargement.findOne({
            token: token
        }).then(charg => {
            if (charg != null) {
                socket.broadcast.to(token).emit("CHA.deletePos_Notif", charg.positions[index].numPosition);
                charg.logs.push({
                    type: "deletePos",
                    posnum: charg.positions[index].numPosition,
                    user: user,
                    date: moment().format()
                });
                console.tag("SOCKET").time().file().info(`CHA.deletePos Delete de  ${token} / ${charg.positions[index].numPosition} / ${user}`);
                charg.positions.splice(index, 1);
                charg.save(function(err) {
                    if (err) throw err;
                });
            }
        }).catch(err => {
            if (err) throw err;
        });
    });

    socket.on("CHA.SwapPos", (token, indexA, indexB, user) => {
        Chargement.findOne({
            token: token
        }).then(charg => {
            if (charg != null) {
                socket.broadcast.to(token).emit("CHA.SwapPos_Notif", {
                    numA: charg.positions[indexA].numPosition,
                    numB: charg.positions[indexB].numPosition
                });
                charg.logs.push({
                    type: "SwapPos",
                    posnum: `${charg.positions[indexA].numPosition} > ${charg.positions[indexB].numPosition}`,
                    user: user,
                    date: moment().format()
                });
                console.tag("SOCKET").time().file().info(`CHA.SwapPos Swap de  ${token} / ${charg.positions[indexA].numPosition} et ${charg.positions[indexB].numPosition} / ${user}`);
                charg.positions.forEach(item => {
                    console.log(item.numPosition);
                });
                const b = charg.positions[indexA];
                charg.positions[indexA] = charg.positions[indexB];
                charg.positions[indexB] = b;
                charg.positions.forEach(item => {
                    console.log(item.numPosition);
                });
                charg.save(function(err) {
                    if (err) throw err;
                });
            }
        }).catch(err => {
            if (err) throw err;
        });
    });

    socket.on("CHA.Cloture", (token, user) => {
        Chargement.findOne({
            token: token
        }).then(charg => {
            if (charg != null) {
                socket.broadcast.to(token).emit("CHA.Cloture_Notif");
                charg.logs.push({
                    type: "Cloture",
                    user: user,
                    date: moment().format()
                });
                charg.status = "close";
                console.tag("SOCKET").time().file().info(`CHA.Cloture Cloture de  ${token} / ${user}`);
                Chargement.remove({
                    token: token
                });
                charg.token = `${token}_${moment().format("ddd-Do-kk:mm")}`;
                charg.save(function(err) {
                    if (err) throw err;
                });
            }
        }).catch(err => {
            if (err) throw err;
        });
    });

    socket.on("disconnect", () => {
        console.tag("SOCKET").time().file().info(`Got disconnect! ${socket.id}`);
        UserDcs.findOne({
            socketId: socket.id
        }, (err, user) => {
            if (err) throw err;
            if (user != null) {
                user.connected = false;
                user.save((err) => {
                    if (err) throw err;
                    console.tag("SOCKET").time().file().info(`USER : ${user.code} DISCONN`);
                    io.to("desktop").emit("suppSmart", user.code);
                });
            }
        });
    });
});
