const UserDcs = require("./../_MongoDB/models/userdcs");
const Chargement = require("./../_MongoDB/models/chargement");
const {Position} = require("./../_MongoDB/models/position");
const moment = require("moment");
const request = require("request");

//SOCKET
module.exports = (io, console, storePos) =>{
    io.on("connection", function(socket) {
        // console.tag("SOCKET").time().file().info(`Connect! ${socket.id}`);
        socket.on("handshake", handshake => {
            if (handshake.plateforme == "smartphone") {
                UserDcs.findOne({
                    code: handshake.user
                }, (err, user) => {
                    // io.to(user.socketId).emit("logout");
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
                UserDcs.find({connected:true}, function(err, users) {
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
                    Chargement.update({
                        token: token
                    }, {
                        $pull: {
                            users: {
                                user: user
                            }
                        }
                    },
            (err, val) => {
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
                        const newPos = new Position(pos);
                        newPos.save(function(err) {
                            if (err) throw err;
                        });

                        charg.positions.push(newPos.numPosition);
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

        socket.on("CHA.addColisFictif", (token, numPosition, nbColisFictif, user) => {
            Chargement.findOne({
                token: token
            }).then(charg => {
                if (charg != null) {
                    Position.findOne({
                        numPosition: numPosition
                    }).then(pos => {
                        if (pos != null) {
                            pos.nbColisFictif = nbColisFictif;
                            pos.save(function(err) {
                                if (err) throw err;
                                console.tag("SOCKET").time().file().info(`CHA.addColisFictif UPDATE POS ${numPosition} / ${user}`);
                                socket.broadcast.to(token).emit("CHA.addColisFictif_Notif", {
                                    numPosition: numPosition,
                                    nbColisFictif: nbColisFictif
                                });
                            });
                        }
                    });
                    charg.logs.push({
                        type: "addColisFictif",
                        user: user,
                        date: moment().format()
                    });
                    charg.save(function(err) {
                        if (err) throw err;
                        console.tag("SOCKET").time().file().info(`CHA.addColisFictif UPDATE CHARG ${token} / ${numPosition} / ${user}`);
                    });
                }
            }).catch(err => {
                if (err) throw err;
            });
        });

        socket.on("CHA.addCol", (token, numPosition, numColis, user) => {
            Chargement.findOne({
                token: token
            }).then(charg => {
                if (charg != null) {
                    charg.logs.push({
                        type: `addCol ${numColis}`,
                        user: user,
                        date: moment().format()
                    });

                    Position.update(
                        {
                            numPosition: numPosition,
                            "codebarre.numero": numColis
                        },
                        {
                            $set: {
                                "codebarre.$.isScanner": true
                            }
                        },
                (err, result) => {
                    console.log(result);
                });

                    charg.save((err) => {
                        if (err) throw err;
                        console.tag("SOCKET").time().file().info(`CHA.addCol UPDATE ${token} / ${numColis} / ${user}`);
                    });
                    socket.broadcast.to(token).emit("CHA.addCol_Notif", numColis);
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

        socket.on("CHA.Cloture", (token, user, zone, commande) => {
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
                        const options = {
                            method: "POST",
                            url: "http://10.1.2.70/DCSAPP/api/creaeve",
                            headers: {
                                "cache-control": "no-cache",
                                "content-type": "application/json",
                                "x-access-token": "w25K}54dkaE/[dgduVqcX9VicQF17u"
                            },
                            body: {
                                GRPQUIC: user,
                                GRPPORTE: zone,
                                GRPCOMMANDE: commande
                            },
                            json: true
                        };
                        request(options, function(error, response, body) {
                            if (error) throw new Error(error);
                            console.log(body);
                        });
                    });
                }
            }).catch(err => {
                if (err) throw err;
            });
        });

        socket.on("disconnect", () => {
            // console.tag("SOCKET").time().file().info(`Got disconnect! ${socket.id}`);
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
};
