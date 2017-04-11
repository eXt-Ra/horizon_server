"use strict";
const express = require("express"); // call express
const app = express();
const busboy = require("connect-busboy");
const _ = require("lodash");
const scribe = require("scribe-js")();
const console = process.console;
const storage = require("node-persist");

//PORT WEBSOCKET
var server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8081);

const port = process.env.PORT || 8080;
const router = express.Router();

app.use(busboy());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Store Position Andsoft
storage.init({
    dir: "store",
    ttl: true
}).then(() => {
    console.tag({
        msg: "STORAGE | UP",
        colors: ["italic", "grey", "bold"]
    }).time().file().info("Storage up");
}).catch(e => {
    console.tag({
        msg: "STORAGE | DOWN",
        colors: ["italic", "red", "bold"]
    }).time().file().error(e);
});

require("./organisms/getPosition")(router, console, storage);
require("./organisms/apiStore")(router, console, storage);
require("./molecules/getSalarie")(router, console);
require("./molecules/getZone")(router, console);
require("./molecules/getZones")(router, console);
require("./molecules/getEvents")(router, console);
require("./molecules/postImage")(router, console);
require("./molecules/getIcoEvents")(router, console);
require("./molecules/postEvent")(router, console);

require("./organisms/getInfoGroupage")(router, console);

app.use("/api", router);
app.listen(port);

app.use("/logs", scribe.webPanel());

console.tag({
    msg: "START",
    colors: ["italic", "green", "bold"]
}).time().file().info(`Magic happens on port ${port}`);

//SOCKET
const listSmart = [];

io.on("connection", function(socket) {
    console.tag("SOCKET").time().file().info(`Got connect! ${socket.id}`);
    socket.on("handshake", handshake => {
        if (handshake.plateforme == "smartphone") {
            const newSmart = {};
            newSmart.user = handshake.user;
            newSmart.socketId = socket.id;
            const s = _.find(listSmart, (o) => {
                return o.user == handshake.user;
            });
            if (s == undefined) {
                listSmart.push(newSmart);
                console.tag("SOCKET").time().file().info(`USER : ${handshake.user}`);
                socket.join("smart");
                io.to("desktop").emit("newSmart", newSmart);
            } else {
                s.socketId = socket.id;
            }
        } else {
            socket.join("desktop");
            socket.emit("listSmart", listSmart);
        }
    });
    socket.on("disconnect", () => {
        console.tag("SOCKET").time().file().info(`Got disconnect! ${socket.id}`);
        listSmart.forEach((smart, index) => {
            if (smart.socketId === socket.id) {
                console.tag("SOCKET").time().file().info(`Supp de ${smart.user}`);
                listSmart.splice(index, 1);
                io.to("desktop").emit("suppSmart", smart.user);
            }
        });
    });
});
