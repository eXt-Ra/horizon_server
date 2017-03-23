"use strict";
const express = require("express"); // call express
const app = express();
// const server = require("http").Server(app);
// const io = require("socket.io")(server);
const busboy = require("connect-busboy");

const sql = require("mssql");
const conn = require("./conn");

const scribe = require("scribe-js")();
const console = process.console;

// const nodemailer = require("nodemailer");
//
// const smtpConfig = {
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//         user: "servernode.dcs@gmail.com",
//         pass: "8Ed-xZs-2Bo-t2q"
//     }
// };

// const transporter = nodemailer.createTransport(smtpConfig);

const fs = require("fs");
const storage = require("node-persist");

const getPosProdTable = require("./lib/getPosProdTable");
const getPosTempTable = require("./lib/getPosTempTable");

const getPosStorage = require("./lib/getPosStorage");

const getColisProdTable = require("./lib/getColisProdTable");
const getColisTempTable = require("./lib/getColisTempTable");

const getEventProd = require("./lib/getEventProd");

const traitColis = require("./lib/traitColis");

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

app.use(busboy());

const port = process.env.PORT || 8080;
const router = express.Router();
app.use("/api", router);

// API
//GET ACTION
router.get("/:action/:user/:numColis", (req, res) => {
    //is in storage
    let newStorage = {};
    getPosStorage(req.params.numColis)
        .then(resStore => {
            if (resStore != undefined) {
                console.tag({
                    msg: `STORAGE | ${req.params.action}`,
                    colors: ["italic", "grey", "bold"]
                }).time().file().info({
                    num: resStore.numPosition,
                    user: req.params.user
                });
                if (req.params.action != "infocolis") {
                    traitColis(req.params.numColis, req.params.action, req.params.user, req.query.zone);
                }
                res.status(200).json(resStore);
                throw "finish";
            } else {
                // is position in tempTable
                return getPosTempTable(req.params.numColis);
            }
        }).then(resPos => {
            if (resPos.length == 0) {
                console.tag({
                    msg: `TEMP_DB | ${req.params.action}`,
                    colors: ["italic", "magenta", "bold"]
                }).time().file().info(`no result ${req.params.numColis} par ${req.params.user}`);
                // is position in prodTable
                return getPosProdTable(req.params.numColis);
            } else {
                newStorage = resPos[0];
                //load colis sql temp
                return getColisTempTable(resPos[0].idPosition)
                    .then(resColis => {
                        newStorage.codebarre = resColis;
                        return getEventProd(resPos[0].idPosition);
                    }).then(resEvent => {
                        newStorage.evenement = resEvent;
                        //storage de la position
                        storage.setItem(newStorage.numPosition, newStorage)
                            .then(() => {
                                if (req.params.action != "infocolis") {
                                    traitColis(req.params.numColis, req.params.action);
                                }
                            });
                        console.tag({
                            msg: `TEMP_DB | ${req.params.action}`,
                            colors: ["italic", "magenta", "bold"]
                        }).time().file().info({
                            num: req.params.numColis,
                            user: req.params.user
                        });
                        res.status(200).json(newStorage);
                    }).catch(err => {
                        res.status(500).json(err);
                    });
            }
        }).then(resPos => {
            if (resPos.length == 0) {
                console.tag({
                    msg: `PROD_DB | ${req.params.action}`,
                    colors: ["italic", "blue", "bold"]
                }).time().file().info(`no result ${req.params.numColis} par ${req.params.user}`);
                res.status(200).json(resPos);
                throw "finish";
            } else {
                newStorage = resPos[0];
                //load colis sql prod
                getColisProdTable(resPos[0].idPosition)
                    .then(resColis => {
                        newStorage.codebarre = resColis;
                        return getEventProd(resPos[0].idPosition);
                    }).then(resEvent => {
                        newStorage.evenement = resEvent;
                        //storage de la position
                        storage.setItem(newStorage.numPosition, newStorage)
                            .then(() => {
                                if (req.params.action != "infocolis") {
                                    traitColis(req.params.numColis, req.params.action);
                                }
                            });
                        console.tag({
                            msg: `PROD_DB | ${req.params.action}`,
                            colors: ["italic", "blue", "bold"]
                        }).time().file().info({
                            num: req.params.numColis,
                            user: req.params.user
                        });
                        res.status(200).json(newStorage);
                        throw "finish";
                    });
            }
        }).catch(err => {
            res.status(500).json(err);
        });
});

//GET SALARIE
router.get("/salarie/:val", (req, res) => {
    new Promise((resolve, reject) => {
        new sql.Request(conn).input("val", sql.NVarChar, req.params.val)
            .query("SELECT TOP 1 SALCODE,SALNUMPERMIS, SALSOCCODE FROM SALARIE WHERE SALCODE=@val OR SALNUMPERMIS=@val", function(err, recordset) {
                if (err) {
                    console.tag("SALARIE").time().file().error(err);
                    reject(err);
                }
                console.tag("SALARIE").time().file().info(req.params.val);
                resolve(recordset);
            });
    }).then(result => {
        res.json(result);

    }).catch(err => {
        res.json({
            error: err
        });
    });
});

//GET ZONE
router.get("/zone/:val", (req, res) => {
    new Promise((resolve, reject) => {
        new sql.Request(conn).input("val", sql.NVarChar, req.params.val)
            .query(`SELECT
                    QUACODEL1 as codeZone,
                    QUALIBL1 as libZone
                    FROM QUAI
                    WHERE QUASOCCODE LIKE '${req.query.societe}'
                    AND QUACODEL1 = @val`,
                (err, recordset) => {
                    if (err) {
                        console.tag("ZONE").time().file().error(err);
                        reject(err);
                    }
                    console.tag("ZONE").time().file().info(req.params.val);
                    resolve(recordset);
                });
    }).then(result => {
        res.json(result[0]);
    }).catch(err => {
        res.json({
            error: err
        });
    });
});

//POST IMAGE
router.post("/image", function(req, res) {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on("file", (fieldname, file, filename) => {
        console.tag("UPLOAD_IMG").time().file().info(`Start upload ${filename}`);
        fstream = fs.createWriteStream("images/" + filename);
        file.pipe(fstream);

        fstream.on("error", err => {
            console.tag({
                msg: "UPLOAD_IMG",
                colors: ["blue", "bold"]
            }).time().file().error(err);
            res.status(500).send(err);
        });

        fstream.on("finish", () => {
            console.tag({
                msg: "UPLOAD_IMG",
                colors: ["blue", "bold"]
            }).time().file().info(`Finish upload ${filename}`);
            res.end();
        });
    });
});

//POST EVENT
router.post("/event", function(req, res) {
    console.log(req.query.codeEvent);
    console.log(req.query.remarque);
    console.log(req.query.imgList);
    res.send("ok");
});

app.listen(port);
app.use("/logs", scribe.webPanel());

console.tag({
    msg: "START",
    colors: ["italic", "green", "bold"]
}).time().file().info(`Magic happens on port ${port}`);

// var mailOptions = {
//     from: "\"server DCS\" <servernode.dcs@gmail.com>", // sender address
//     to: "vanardois.romain@gmail.com", // list of receivers
//     subject: "Server DCS START",
//     text: "Server DCS START",
//     /*eslint-disable */
//     html: `<!doctype html><html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\"><head> <title></title> <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"> <style type=\"text/css\"> #outlook a{padding: 0;}.ReadMsgBody{width: 100%;}.ExternalClass{width: 100%;}.ExternalClass *{line-height: 100%;}body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}p{display: block; margin: 13px 0;}</style> <style type=\"text/css\"> @media only screen and (max-width:480px){@-ms-viewport{width: 320px;}@viewport{width: 320px;}}</style><!--[if mso]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type=\"text/css\"> .outlook-group-fix{width:100% !important;}</style><![endif]--> <link href=\"https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700\" rel=\"stylesheet\" type=\"text/css\"> <style type=\"text/css\"> @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700); </style> <style type=\"text/css\"> @media only screen and (min-width:480px){.mj-column-per-100{width: 100%!important;}}</style></head><body style=\"background: #d6dde5;\"> <div style=\"background-color:#d6dde5;\"><!--[if mso | IE]> <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" align=\"center\" style=\"width:600px;\"> <tr> <td style=\"line-height:0px;font-size:0px;mso-line-height-rule:exactly;\"><![endif]--> <div style=\"margin:0px auto;max-width:600px;background:#ffffff url(http://ljdchost.com/vabBeMN.gif) top center / cover no-repeat;\"><!--[if mso | IE]> <v:rect xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"true\" stroke=\"false\" style=\"width:600px;\"> <v:fill origin=\"0.5, 0\" position=\"0.5,0\" type=\"tile\" src=\"http://ljdchost.com/vabBeMN.gif\"/> <v:textbox style=\"mso-fit-shape-to-text:true\" inset=\"0,0,0,0\"><![endif]--> <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-size:0px;width:100%;background:#ffffff url(http://ljdchost.com/vabBeMN.gif) top center / cover no-repeat;\" align=\"center\" border=\"0\" background=\"http://ljdchost.com/vabBeMN.gif\"> <tbody> <tr> <td style=\"text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;padding-bottom:27px;padding-top:0px;\"><!--[if mso | IE]> <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td style=\"vertical-align:undefined;width:600px;\"><![endif]--> <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse;border-spacing:0px;\" align=\"center\" border=\"0\"> <tbody> <tr> <td style=\"width:100px;\"> <a href=\"https://mjml.io\" target=\"_blank\"><img alt=\"Amario logo\" title=\"\" height=\"auto\" src=\"http://i.imgur.com/arbTnma.png\" style=\"border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:auto;\" width=\"100\"></a> </td></tr></tbody> </table><!--[if mso | IE]> </td><td style=\"vertical-align:top;width:600px;\"><![endif]--> <div class=\"mj-column-per-100 outlook-group-fix\" style=\"vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;\"> <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"vertical-align:top;\" width=\"100%\" border=\"0\"> <tbody> <tr> <td style=\"word-break:break-word;font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;padding-right:25px;padding-left:25px;\" align=\"center\"> <div class=\"\" style=\"cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:center;\"> <p><span style=\"font-weight: bold;\"><span style=\"color: rgb(255, 255, 255);\"><span style=\"font-size: 27px;\">SERVER START</span></span> </span> </p></div></td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table><!--[if mso | IE]> </v:textbox> </v:rect><![endif]--> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </div></body></html>`
//     /*eslint-enable */
// };

// send mail with defined transport object
// transporter.sendMail(mailOptions, function(error, info) {
//     if (error) {
//         return console.log(error);
//     }
//     console.tag({
//         msg: "START",
//         colors: ["italic", "green", "bold"]
//     }).time().file().info(`Message sent: ${info.response}`);
// });
