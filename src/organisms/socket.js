const UserDcs = require("./../_MongoDB/models/userdcs");
const Chargement = require("./../_MongoDB/models/chargement");
const {Position} = require("./../_MongoDB/models/position");
const sendMail = require("./../mail/nodemailer");
const chargementErreur = require("./../mail/chargementErreur");
const moment = require("moment");
const request = require("request");

//SOCKET
module.exports = (io, console, storePos) =>{
    io.on("connection", function(socket) {
        console.info(`Connect! ${socket.id}`);
        socket.on("handshake", handshake => {
            if (handshake.plateforme == "smartphone") {
                UserDcs.findOne({
                    code: handshake.user
                }, (err, user) => {
                    // io.to(user.socketId).emit("logout");
                    console.info(`${socket.id} set to ${handshake.user}`);
                    user.socketId = socket.id;
                    user.serial = handshake.serial;
                    const currentDate = new Date();
                    user.lastConn = currentDate;
                    console.info(`USER : ${handshake.user} CONN`);
                    socket.join("smart");
                    socket.emit("handshake_Notif");
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
            console.info(`closeHandShake ${socket.id}`);
            UserDcs.findOne({
                code: user
            }, (err, user) => {
                if (err) throw err;
                if (user != null) {
                    user.connected = false;
                    console.info(`USER : ${user.code} DISCONN`);
                    io.to("desktop").emit("suppSmart", user.code);
                    user.save((err) => {
                        if (err) throw err;
                    });
                }
            });
        });

        socket.on("joinChargement", (token, user) => {
            console.info(`Join Charg de ${token} de ${user} sur ${socket.id}`);
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
                    const s = charg.users.find(u =>{
                        return u.user === user;
                    });
                    console.info(s);
                    if (s != undefined) {
                        Chargement.update({
                            token: token
                        }, {
                            $pull: {
                                users: {
                                    user: user
                                }
                            }
                        }, (err, val) => {
                            console.info(val);
                        });
                    }
                    charg.users.push({
                        user: user,
                        date: moment().format()
                    });
                    charg.save(function(err) {
                        if (err) throw err;
                        socket.emit("joinChargement_Notif");
                        console.info(`joinChargement ${token} / ${user}`);
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
                    }, (err, val) => {
                        console.log(val);
                    });
                    socket.emit("leaveChargement_Notif");
                    console.info(`leaveChargement ${token} / ${user}`);
                }
            }).catch(err => {
                if (err) throw err;
            });
        });

        socket.on("CHA.addPos", (token, numpos, user, index) => {
            Chargement.findOne({
                token: token
            }).then(charg => {
                if (charg != null) {
                    storePos.getItem(numpos).then(pos => {
                        pos.ordrePosition = Number(index);
                        const newPos = new Position(pos);
                        newPos.save(function(err) {
                            if (err){
                                console.info(`CHA.addPos Position en double ${numpos} / ${user}`);
                            }
                        });
                        if (charg.positions.length == 0) {
                            charg.positions.push(newPos.numPosition);
                        }else {
                            charg.positions.unshift(newPos.numPosition);
                        }

                        charg.logs.push({
                            type: "addPos",
                            user: user,
                            date: moment().format(),
                            info: newPos.numPosition
                        });
                        charg.save(function(err) {
                            if (err) throw err;
                            console.info(`CHA.addPos UPDATE ${token} / ${numpos} / ${user}`);
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
                                console.info(`CHA.addColisFictif UPDATE POS ${numPosition} / ${user}`);
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
                        date: moment().format(),
                        info: `${numPosition} / ${nbColisFictif}`
                    });
                    charg.save(function(err) {
                        if (err) throw err;
                        console.info(`CHA.addColisFictif UPDATE CHARG ${token} / ${numPosition} / ${user}`);
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
                        type: "addCol",
                        user: user,
                        date: moment().format(),
                        info: numColis
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
                    console.info(result);
                });

                    charg.save((err) => {
                        if (err) throw err;
                        console.info(`CHA.addCol UPDATE ${token} / ${numColis} / ${user}`);
                    });
                    socket.broadcast.to(token).emit("CHA.addCol_Notif", numColis);
                }
            }).catch(err => {
                if (err) throw err;
            });
        });

        socket.on("CHA.deletePos", (token, numpos, user) => {
            Chargement.findOne({
                token: token
            }).then(charg => {
                if (charg != null) {
                    socket.broadcast.to(token).emit("CHA.deletePos_Notif", numpos);
                    charg.logs.push({
                        type: "deletePos",
                        user: user,
                        date: moment().format(),
                        info: numpos
                    });
                    console.info(`CHA.deletePos Delete de  ${token} / ${numpos} / ${user}`);
                    charg.positions.forEach(item =>{
                        const i = item.indexOf(numpos);
                        if(i != -1) {
                            charg.positions.splice(i, 1);
                        }
                    });
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
                        numA: charg.positions[indexA],
                        numB: charg.positions[indexB]
                    });
                    charg.logs.push({
                        type: "SwapPos",
                        user: user,
                        date: moment().format(),
                        info:`${charg.positions[indexA].numPosition} > ${charg.positions[indexB].numPosition}`,
                    });
                    console.info(`CHA.SwapPos Swap de  ${token} / ${charg.positions[indexA].numPosition} et ${charg.positions[indexB].numPosition} / ${user}`);
                    const b = charg.positions[indexA];
                    charg.positions[indexA] = charg.positions[indexB];
                    charg.positions[indexB] = b;
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
                    console.info(`CHA.Cloture Cloture de  ${token} / ${user}`);
                    const data = [];
                    JSON.parse(commande).forEach(pos =>{
                        const newdata = {
                            OTSID: pos.idPosition,
                            OTSNUM: pos.numPosition
                        };
                        data.push(newdata);
                    });
                    console.info({
                        GRPQUIC: user,
                        GRPPORTE: zone,
                        GRPCOMMANDE: data
                    });
                    const options = {
                        method: "POST",
                        url: "http://10.1.2.70/DCSAPP/api/creagrp",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: {
                            GRPQUIC: user,
                            GRPPORTE: zone,
                            GRPCOMMANDE: data
                        },
                        json: true
                    };
                    request(options, function(error, response, body) {
                        if (error) throw new Error(error);
                        console.info(body);
                        if (body != "0") {
                            charg.status = "close";
                            charg.token = `${token}_${body}`;
                            charg.groupage = body;
                            charg.save(err => {
                                if (err) throw err;
                            });
                        }else {
                            charg.status = "erreur";
                            charg.token = `${token}_${moment().format("ddd-Do-kk:mm")}_err`;
                            charg.save(err => {
                                if (err) throw err;
                                sendMail(chargementErreur(charg.zone,charg.societe, charg.userCrea));
                            });
                        }
                    });

                }
            }).catch(err => {
                if (err) throw err;
            });
        });

        socket.on("forcedisconnect", (user) => {
            // console.tag("SOCKET").time().file().info(`Got disconnect! ${socket.id}`);
            UserDcs.findOne({
                code: user
            }, (err, user) => {
                if (err) throw err;
                if (user != null) {
                    user.connected = false;
                    user.save((err) => {
                        if (err) throw err;
                        console.info(`SOCKET USER : ${user.code} FORCE DISCONN`);
                        io.to("desktop").emit("suppSmart", user.code);
                        io.to(user.socketId).emit("forcedisconnect_Notif");
                    });
                }
            });
        });

        socket.on("disconnect", () => {
            console.info(`Got disconnect! ${socket.id}`);
            UserDcs.findOne({
                socketId: socket.id
            }, (err, user) => {
                if (err) throw err;
                if (user != null) {
                    user.connected = false;
                    user.save((err) => {
                        if (err) throw err;
                        console.info(`SOCKET USER : ${user.code} DISCONN`);
                        io.to("desktop").emit("suppSmart", user.code);
                    });
                }
            });
        });
    });
};
