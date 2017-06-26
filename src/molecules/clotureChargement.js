const Chargement = require("./../_MongoDB/models/chargement");
const sendMail = require("./../mail/nodemailer");
const chargementErreur = require("./../mail/chargementErreur");
const moment = require("moment");
const request = require("request");

module.exports = (router, console, io) =>{
    router.post("/chargement/cloture/:token", (req, res) => {
        Chargement.findOne({
            token: req.params.token
        }).then(charg => {
            if (charg != null) {
                // socket.broadcast.to(token).emit("CHA.Cloture_Notif");
                io.to(req.params.token).emit("CHA.Cloture_Notif");
                charg.logs.push({
                    type: "Cloture",
                    user: req.query.user,
                    date: moment().format()
                });
                console.info(`CHA.Cloture Cloture de  ${req.params.token} / ${req.query.user}`);

                const data = [];
                JSON.parse(req.query.commande).forEach(pos =>{
                    const newdata = {
                        OTSID: pos.idPosition,
                        OTSNUM: pos.numPosition
                    };
                    data.push(newdata);
                });
                console.info({
                    GRPQUIC: req.query.user,
                    GRPPORTE: req.query.zone,
                    GRPCOMMANDE: data
                });
                const options = {
                    method: "POST",
                    url: "http://10.1.2.70/DCSAPP/api/creagrp",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: {
                        GRPQUIC: req.query.user,
                        GRPPORTE: req.query.zone,
                        GRPCOMMANDE: data
                    },
                    json: true
                };
                request(options, function(error, response, body) {
                    if (error) throw new Error(error);
                    console.info(body);
                    if (body != "0") {
                        charg.status = "close";
                        charg.token = `${req.params.token}_${body}`;
                        charg.groupage = body;
                        charg.save(err => {
                            if (err) throw err;
                            res.status(200).json(charg.groupage);
                        });
                    }else {
                        charg.status = "erreur";
                        charg.token = `${req.params.token}_${moment().format("ddd-Do-kk:mm")}_err`;
                        charg.save(err => {
                            if (err) throw err;
                            res.status(500).json(err);
                            sendMail(chargementErreur(charg.zone,charg.societe, charg.userCrea));
                        });
                    }
                });

            }
        }).catch(err => {
            if (err) throw err;
        });
    });
};
