require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 60);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("mssql");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var console = process.console;

var connection = new sql.Connection({
    user: "sa",
    password: "jb",
    server: "10.1.2.66",
    database: "ANDSYS_JET",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
});

connection.connect(function (err) {
    if (err) {
        console.tag("CONN").time().file().error(err);
    }
});
module.exports = connection;

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("moment");

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("mongoose");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(3);
var Schema = mongoose.Schema;
// const {positionSchema} = require("./position");

var chargementSchema = new Schema({
    token: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    dateCrea: { type: Date, required: true },
    userCrea: { type: String, required: true },
    logs: Array,
    positions: Array,
    users: Array,
    groupage: String,
    societe: { type: String, required: true },
    zone: { type: String, required: true }
});

var Chargement = mongoose.model("Chargement", chargementSchema);
module.exports = Chargement;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(3);
var Schema = mongoose.Schema;

var userDcsSchema = new Schema({
    code: { type: String, required: true, unique: true },
    societe: { type: String, required: true },
    connected: Boolean,
    lastConn: Date,
    firstConn: Date,
    socketId: String
});

userDcsSchema.pre("save", function (next) {
    var currentDate = new Date();
    // this.lastConn = currentDate;
    // if created_at doesn't exist, add to that field
    if (!this.firstConn) this.firstConn = currentDate;

    next();
});

var UserDcs = mongoose.model("UserDcs", userDcsSchema);
module.exports = UserDcs;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

var request = __webpack_require__(11);
var moment = __webpack_require__(2);

module.exports = function (codeEvent, libEvent, remarque, user, idPosition) {
    return new Promise(function (resolve, reject) {
        var options = {
            method: "POST",
            url: "http://10.1.2.70/DCSAPP/api/creaeve",
            headers: {
                "cache-control": "no-cache",
                "content-type": "application/json",
                "x-access-token": "w25K}54dkaE/[dgduVqcX9VicQF17u"
            },
            body: {
                EVECODE: codeEvent,
                EVELIB: libEvent,
                EVEDATE: moment().format("DD/MM/YYYY"),
                EVEOTEVAL1: remarque,
                EVEQUIC: user,
                EVEOTSID: idPosition,
                EVETABLE: "ORDRE"
            },
            json: true
        };
        console.log("{\n            EVECODE: " + codeEvent + ",\n            EVELIB: " + libEvent + ",\n            EVEDATE: " + moment().format("DD/MM/YYYY") + ",\n            EVEOTEVAL1: " + remarque + ",\n            EVEQUIC: " + user + ",\n            EVEOTSID: " + idPosition + ",\n            EVETABLE: \"ORDRE\"\n        }");
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(3);
var Schema = mongoose.Schema;

var configSchema = new Schema({
    name: { type: String, required: true, unique: true },
    societe: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
    chargementMode: { type: String, required: true },
    dechargementMode: { type: String, required: true },
    inventaireMode: { type: String, required: true },
    logoutTime: { type: String, required: true },
    wrongZoneAlert: { type: Boolean, required: true },
    scanManuel: { type: Boolean, required: true }
});

var Config = mongoose.model("Config", configSchema);
module.exports = Config;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(3);
var Schema = mongoose.Schema;

var positionSchema = new Schema({
    idPosition: { type: String, required: true, unique: true },
    numPosition: { type: String, required: true, unique: true },
    refClient: String,
    nbColis: Number,
    nbPalette: Number,
    nbColisFictif: Number,
    poids: Number,
    ml: Number,
    col: Number,
    colisSurPal: Number,
    dateImpLiv: Date,
    clientNom: String,
    expediteurNom: String,
    expediteurAdresse: String,
    expediteurVille: String,
    expediteurCp: String,
    chargementNom: String,
    chargementAdresse: String,
    chargementVille: String,
    chargementCp: Number,
    livraisonNom: String,
    livraisonAdresse: String,
    livraisonVille: String,
    livraisonCp: Number,
    zoneQuaiTheorique: String,
    codebarre: Array,
    societe: String,
    evenement: Array
});

var Position = mongoose.model("Position", positionSchema);

module.exports = {
    Position: Position,
    positionSchema: positionSchema
};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var nodemailer = __webpack_require__(57);

var smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "servernode.dcs@gmail.com",
        pass: "8Ed-xZs-2Bo-t2q"
    }
};
var transporter = nodemailer.createTransport(smtpConfig);

// transporter.sendMail(mail.mailOptions);

module.exports = function (mail) {
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mail, function (err, info) {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

// const storage = require("node-persist");
var updateColisStorage = __webpack_require__(41);
var updateColisProd = __webpack_require__(40);
var traitFullFlash = __webpack_require__(39);

var console = process.console;

module.exports = function (num, action, user, zone, storage) {
    return new Promise(function (resolve, reject) {
        updateColisStorage(num, action, user, zone, storage).then(function (pos) {
            return storage.setItem(pos.numPosition, pos);
        }).then(function () {
            console.tag({
                msg: "UPDATE_STORAGE | " + action,
                colors: ["italic", "magenta", "bgBlue", "bold"]
            }).time().file().info("Update " + action + " from " + num);
            //update DB
            return updateColisProd(num, action, user, zone);
        }).then(function () {
            if (zone != undefined) {
                console.tag({
                    msg: "UPDATE_DB | " + action,
                    colors: ["italic", "magenta", "bgWhite", "bold"]
                }).time().file().info("Update " + action + " from " + num + " at " + zone);
            } else {
                console.tag({
                    msg: "UPDATE_DB | " + action,
                    colors: ["italic", "magenta", "bgWhite", "bold"]
                }).time().file().info("Update " + action + " from " + num);
            }
            //check if fullFlash de l'action
            return traitFullFlash(num, action, storage);
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    });
};

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = require("request");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(50);
var helmet = __webpack_require__(53);
var app = express();
var busboy = __webpack_require__(49);
var scribe = __webpack_require__(58)();
var console = process.console;
var storage = __webpack_require__(56);
var UserDcs = __webpack_require__(5);
var sendMail = __webpack_require__(9);

app.use(helmet());

//MongoDB
var mongoose = __webpack_require__(3);

mongoose.connect("mongodb://RomainHori:Dealtis25-@localhost:27017/Horizon");

// Use native promises
mongoose.Promise = Promise;

//Model
var UserApi = __webpack_require__(13);

//Port Websocket
var server = __webpack_require__(54).Server(app);
var io = __webpack_require__(59)(server);
server.listen(8081);

var port = process.env.PORT || 8080;
var router = express.Router();

app.get("/setup", function (req, res) {
    var Romain = new UserApi({
        name: "Romain",
        token: "w25K}54dkaE/[dgduVqcX9VicQF17u",
        societe: "STJ25"
    });
    Romain.save(function (err) {
        if (err) throw err;

        console.log("User saved successfully");
        res.json({
            success: true
        });
    });
});

app.use(busboy());

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
    }, function (err, user) {
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
var storePos = storage.create({
    dir: "storePos",
    ttl: true,
    expiredInterval: 2 * 60 * 1000
});

storePos.init().then(function () {
    console.tag({
        msg: "STORAGEPOS | UP",
        colors: ["italic", "grey", "bold"]
    }).time().file().info("Storage up");
}).catch(function (e) {
    console.tag({
        msg: "STORAGEPOS | DOWN",
        colors: ["italic", "red", "bold"]
    }).time().file().error(e);
});

__webpack_require__(46)(router, console, storePos);
__webpack_require__(44)(router, console, storePos);
__webpack_require__(43)(router);
__webpack_require__(33)(router, console);
__webpack_require__(35)(router, console);
__webpack_require__(36)(router, console);
__webpack_require__(23)(router, console);
__webpack_require__(38)(router, console);
__webpack_require__(25)(router, console);
__webpack_require__(37)(router, console, storePos);
__webpack_require__(45)(router, console);
__webpack_require__(16)(router, console);
__webpack_require__(17)(router, console);
__webpack_require__(21)(router, console);
__webpack_require__(15)(router);
__webpack_require__(42)(router);

__webpack_require__(47)(io, console, storePos);

app.use("/api", router);
app.listen(port);

app.use("/logs", scribe.webPanel());
app.use(scribe.express.logger());

//disconnect all user
UserDcs.find({}, function (err, users) {
    if (err) throw err;
    users.forEach(function (user) {
        user.connected = false;
        user.save(function (err) {
            if (err) throw err;
        });
    });
});

console.tag({
    msg: "START",
    colors: ["italic", "green", "bold"]
}).time().file().info("Magic happens on port " + port);

// const startMail = require("./mail/startMail");
//
// sendMail(startMail)
// .then(res => {
//     console.log(res.accepted);
// })
// .catch(err =>{
//     console.log(err);
// });

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(3);
var Schema = mongoose.Schema;

var userApiSchema = new Schema({
  name: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  societe: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

userApiSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

var UserApi = mongoose.model("UserApi", userApiSchema);
module.exports = UserApi;

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = function (porte, societe, user) {
  return {
    from: "\"server DCS\" <servernode.dcs@gmail.com>", // sender address
    to: "vanardois.romain@gmail.com, aregazzoni@dealtis.fr", // list of receivers
    subject: "Erreur Chargement " + porte + " chez " + societe,
    text: "Server DCS START",
    /*eslint-disable */
    html: "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><!--[if IE]><html xmlns=\"http://www.w3.org/1999/xhtml\" class=\"ie-browser\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\"><![endif]--><!--[if !IE]><!--><html style=\"margin: 0;padding: 0;\" xmlns=\"http://www.w3.org/1999/xhtml\"><!--<![endif]--><head>\n          <!--[if gte mso 9]><xml>\n           <o:OfficeDocumentSettings>\n            <o:AllowPNG/>\n            <o:PixelsPerInch>96</o:PixelsPerInch>\n           </o:OfficeDocumentSettings>\n          </xml><![endif]-->\n          <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n          <meta name=\"viewport\" content=\"width=device-width\">\n          <!--[if !mso]><!--><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]-->\n          <title>Template Base</title>\n          <!--[if !mso]><!-- -->\n      \t<link href=\"https://fonts.googleapis.com/css?family=Montserrat\" rel=\"stylesheet\" type=\"text/css\">\n      \t<!--<![endif]-->\n\n          <style type=\"text/css\" id=\"media-query\">\n            body {\n        margin: 0;\n        padding: 0; }\n\n      table, tr, td {\n        vertical-align: top;\n        border-collapse: collapse; }\n\n      .ie-browser table, .mso-container table {\n        table-layout: fixed; }\n\n      * {\n        line-height: inherit; }\n\n      a[x-apple-data-detectors=true] {\n        color: inherit !important;\n        text-decoration: none !important; }\n\n      [owa] .img-container div, [owa] .img-container button {\n        display: block !important; }\n\n      [owa] .fullwidth button {\n        width: 100% !important; }\n\n      .ie-browser .col, [owa] .block-grid .col {\n        display: table-cell;\n        float: none !important;\n        vertical-align: top; }\n\n      .ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {\n        width: 500px !important; }\n\n      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\n        line-height: 100%; }\n\n      .ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {\n        width: 164px !important; }\n\n      .ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {\n        width: 328px !important; }\n\n      .ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {\n        width: 250px !important; }\n\n      .ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {\n        width: 166px !important; }\n\n      .ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {\n        width: 125px !important; }\n\n      .ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {\n        width: 100px !important; }\n\n      .ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {\n        width: 83px !important; }\n\n      .ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {\n        width: 71px !important; }\n\n      .ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {\n        width: 62px !important; }\n\n      .ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {\n        width: 55px !important; }\n\n      .ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {\n        width: 50px !important; }\n\n      .ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {\n        width: 45px !important; }\n\n      .ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {\n        width: 41px !important; }\n\n      @media only screen and (min-width: 520px) {\n        .block-grid {\n          width: 500px !important; }\n        .block-grid .col {\n          display: table-cell;\n          Float: none !important;\n          vertical-align: top; }\n          .block-grid .col.num12 {\n            width: 500px !important; }\n        .block-grid.mixed-two-up .col.num4 {\n          width: 164px !important; }\n        .block-grid.mixed-two-up .col.num8 {\n          width: 328px !important; }\n        .block-grid.two-up .col {\n          width: 250px !important; }\n        .block-grid.three-up .col {\n          width: 166px !important; }\n        .block-grid.four-up .col {\n          width: 125px !important; }\n        .block-grid.five-up .col {\n          width: 100px !important; }\n        .block-grid.six-up .col {\n          width: 83px !important; }\n        .block-grid.seven-up .col {\n          width: 71px !important; }\n        .block-grid.eight-up .col {\n          width: 62px !important; }\n        .block-grid.nine-up .col {\n          width: 55px !important; }\n        .block-grid.ten-up .col {\n          width: 50px !important; }\n        .block-grid.eleven-up .col {\n          width: 45px !important; }\n        .block-grid.twelve-up .col {\n          width: 41px !important; } }\n\n      @media (max-width: 520px) {\n        .block-grid, .col {\n          min-width: 320px !important;\n          max-width: 100% !important; }\n        .block-grid {\n          width: calc(100% - 40px) !important; }\n        .col {\n          width: 100% !important; }\n          .col > div {\n            margin: 0 auto; }\n        img.fullwidth {\n          max-width: 100% !important; } }\n\n          </style>\n      </head>\n      <!--[if mso]>\n      <body class=\"mso-container\" style=\"background-color:#FFFFFF;\">\n      <![endif]-->\n      <!--[if !mso]><!-->\n      <body class=\"clean-body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF\">\n      <!--<![endif]-->\n        <div class=\"nl-container\" style=\"min-width: 320px;Margin: 0 auto;background-color: #FFFFFF\">\n          <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color: #FFFFFF;\"><![endif]-->\n\n          <div style=\"background-color:#ff5722;\">\n            <div style=\"Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\" class=\"block-grid \">\n              <div style=\"border-collapse: collapse;display: table;width: 100%;\">\n                <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"background-color:#ff5722;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 500px;\"><tr class=\"layout-full-width\" style=\"background-color:transparent;\"><![endif]-->\n\n                    <!--[if (mso)|(IE)]><td align=\"center\" width=\"500\" style=\" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;\" valign=\"top\"><![endif]-->\n                  <div class=\"col num12\" style=\"min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;\">\n                    <div style=\"background-color: transparent; width: 100% !important;\">\n                    <!--[if (!mso)&(!IE)]><!--><div style=\"border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;\"><!--<![endif]-->\n\n\n                          <div style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;\">\n        <!--[if (mso)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px;padding-left: 10px; padding-top: 10px; padding-bottom: 10px;\"><table width=\"100%\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td><![endif]-->\n        <div align=\"center\"><div style=\"border-top: 10px solid transparent; width:100%; line-height:0px;\">&nbsp;</div></div>\n        <!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\n      </div>\n\n\n\n                          <!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 0px; padding-left: 0px; padding-top: 30px; padding-bottom: 30px;\"><![endif]-->\n      <div style=\"padding-right: 0px; padding-left: 0px; padding-top: 30px; padding-bottom: 30px;\">\n      \t<div style=\"font-size:12px;line-height:14px;color:#ffffff;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:left;\"><p style=\"margin: 0;font-size: 14px;line-height: 17px;text-align: center\"><strong><span style=\"font-size: 28px; line-height: 33px;\">Erreur de chargement</span></strong></p></div>\n      </div>\n      <!--[if mso]></td></tr></table><![endif]-->\n\n\n\n                          <div style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;\">\n        <!--[if (mso)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px;padding-left: 10px; padding-top: 10px; padding-bottom: 10px;\"><table width=\"100%\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td><![endif]-->\n        <div align=\"center\"><div style=\"border-top: 10px solid transparent; width:100%; line-height:0px;\">&nbsp;</div></div>\n        <!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\n      </div>\n\n\n\n                          <div align=\"center\" class=\"img-container center\" style=\"padding-right: 0px;  padding-left: 0px;\">\n      <!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 0px; padding-left: 0px;\" align=\"center\"><![endif]-->\n        <a href=\"https://beefree.io\" target=\"_blank\">\n          <img class=\"center\" align=\"center\" border=\"0\" src=\"http://i.imgur.com/Ms5LrbU.png\" alt=\"Image\" title=\"Image\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 256px\" width=\"256\">\n        </a>\n      <!--[if mso]></td></tr></table><![endif]-->\n      </div>\n\n\n                    <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n                    </div>\n                  </div>\n                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\n              </div>\n            </div>\n          </div>    <div style=\"background-color:#61626F;\">\n            <div style=\"Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\" class=\"block-grid \">\n              <div style=\"border-collapse: collapse;display: table;width: 100%;\">\n                <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"background-color:#61626F;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 500px;\"><tr class=\"layout-full-width\" style=\"background-color:transparent;\"><![endif]-->\n\n                    <!--[if (mso)|(IE)]><td align=\"center\" width=\"500\" style=\" width:500px; padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:30px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;\" valign=\"top\"><![endif]-->\n                  <div class=\"col num12\" style=\"min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;\">\n                    <div style=\"background-color: transparent; width: 100% !important;\">\n                    <!--[if (!mso)&(!IE)]><!--><div style=\"border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;\"><!--<![endif]-->\n\n\n                          <!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top: 25px; padding-bottom: 10px;\"><![endif]-->\n      <div style=\"padding-right: 10px; padding-left: 10px; padding-top: 25px; padding-bottom: 10px;\">\n      \t<div style=\"font-size:12px;line-height:14px;font-family:'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace;color:#ffffff;text-align:left;\"><p style=\"margin: 0;font-size: 12px;line-height: 14px;text-align: center\"><strong>\n        <span style=\"font-size: 18px; line-height: 21px;\">\n            Erreur sur le chargement " + porte + " chez " + societe + " cr\xE9e par " + user + "\n        </span></strong></p></div>\n      </div>\n      <!--[if mso]></td></tr></table><![endif]-->\n\n\n\n\n      <div align=\"center\" class=\"button-container center\" style=\"padding-right: 10px; padding-left: 10px; padding-top:15px; padding-bottom:10px;\">\n        <!--[if mso]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;\"><tr><td style=\"padding-right: 10px; padding-left: 10px; padding-top:15px; padding-bottom:10px;\" align=\"center\"><v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" href=\"\" style=\"height:42px; v-text-anchor:middle; width:146px;\" arcsize=\"60%\" strokecolor=\"#C7702E\" fillcolor=\"#C7702E\"><w:anchorlock/><center style=\"color:#ffffff; font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size:16px;\"><![endif]-->\n          <div style=\"color: #ffffff; background-color: #C7702E; border-radius: 25px; -webkit-border-radius: 25px; -moz-border-radius: 25px; max-width: 126px; width: 86px; width: 25%; border-top: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; text-align: center; mso-border-alt: none;\">\n            <span style=\"font-size:16px;line-height:32px;\"><strong><span style=\"font-size: 14px; line-height: 28px;\" data-mce-style=\"font-size: 14px; line-height: 28px;\">Voir</span></strong></span>\n          </div>\n        <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->\n      </div>\n\n\n\n                          <div style=\"padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;\">\n        <!--[if (mso)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding-right: 10px;padding-left: 10px; padding-top: 10px; padding-bottom: 10px;\"><table width=\"100%\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td><![endif]-->\n        <div align=\"center\"><div style=\"border-top: 0px solid transparent; width:100%; line-height:0px;\">&nbsp;</div></div>\n        <!--[if (mso)]></td></tr></table></td></tr></table><![endif]-->\n      </div>\n\n\n                    <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n                    </div>\n                  </div>\n                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->\n              </div>\n            </div>\n          </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n        </div>\n      </body></html>"
  };
};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

var Chargement = __webpack_require__(4);

var _require = __webpack_require__(8),
    Position = _require.Position;

var async = __webpack_require__(48);
//chargement exist
module.exports = function (router) {
    router.get("/chargement/:token", function (req, res) {
        var token = req.params.token;
        Chargement.findOne({
            token: token
        }).then(function (charg) {
            if (charg != null) {
                var positions = [];
                async.forEachOf(charg.positions, function (pos, key, callback) {
                    Position.findOne({
                        numPosition: pos
                    }).then(function (item) {
                        positions.push(item);
                        callback();
                    });
                }, function () {
                    res.json(positions);
                });
            } else {
                res.send("NotExist");
            }
        }).catch(function (err) {
            if (err) throw err;
        });
    });
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

var Chargement = __webpack_require__(4);
var moment = __webpack_require__(2);
//Create Chargement
module.exports = function (router, console) {
    router.post("/chargement/create", function (req, res) {
        var zone = req.query.zone;
        var user = req.query.user;
        var societe = req.query.societe;

        var newCharg = new Chargement({
            token: zone + "-" + societe,
            status: "progress",
            dateCrea: moment().format(),
            userCrea: user,
            logs: [],
            societe: societe,
            zone: zone,
            positions: []
        });

        newCharg.save(function (err) {
            if (err) throw err;

            console.tag({
                msg: "CHARGEMENT",
                colors: ["italic", "blue", "bold"]
            }).time().file().info("Chargement Creation Done token = " + zone + "-" + societe);
            res.send("Chargement Creation Done");
        });
    });
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

var Config = __webpack_require__(7);
//Create Chargement
module.exports = function (router, console) {
    router.post("/config/create", function (req, res) {
        var name = req.query.name;
        var societe = req.query.societe;
        var chargementMode = req.query.typechargement;
        var dechargementMode = req.query.typedechargement;
        var inventaireMode = req.query.typeinventaire;
        var logoutTime = req.query.logoutTime;

        var def = false;

        if (req.query.default == "true") {
            def = true;
        } else {
            def = false;
        }

        var zoneAlert = false;

        if (req.query.wrongZoneAlert == "true") {
            zoneAlert = true;
        } else {
            zoneAlert = false;
        }

        var scanManuel = false;

        if (req.query.scanManuel == "true") {
            scanManuel = true;
        } else {
            scanManuel = false;
        }

        var newConfig = new Config({
            name: name,
            societe: societe,
            isDefault: def,
            chargementMode: chargementMode,
            dechargementMode: dechargementMode,
            inventaireMode: inventaireMode,
            logoutTime: logoutTime,
            wrongZoneAlert: zoneAlert,
            scanManuel: scanManuel
        });

        newConfig.save(function (err) {
            if (err) {
                res.status(500).send(err);
                console.tag({
                    msg: "CONFIG",
                    colors: ["italic", "GREEN", "bold"]
                }).time().file().error(err);
            } else {
                console.tag({
                    msg: "CONFIG",
                    colors: ["italic", "GREEN", "bold"]
                }).time().file().info("Config Creation Done token = " + name + "-" + societe);
                res.send("Config Creation Done");
            }
        });
    });

    router.post("/config/update", function (req, res) {
        var name = req.query.name;
        var societe = req.query.societe;
        var chargementMode = req.query.typechargement;
        var dechargementMode = req.query.typedechargement;
        var inventaireMode = req.query.typeinventaire;
        var logoutTime = req.query.logoutTime;

        var def = false;

        if (req.query.default == "true") {
            def = true;
        } else {
            def = false;
        }

        var zoneAlert = false;

        if (req.query.wrongZoneAlert == "true") {
            zoneAlert = true;
        } else {
            zoneAlert = false;
        }

        var scanManuel = false;

        if (req.query.scanManuel == "true") {
            scanManuel = true;
        } else {
            scanManuel = false;
        }

        Config.update({
            name: name
        }, {
            $set: {
                "societe": societe,
                "isDefault": def,
                "chargementMode": chargementMode,
                "dechargementMode": dechargementMode,
                "inventaireMode": inventaireMode,
                "logoutTime": logoutTime,
                "wrongZoneAlert": zoneAlert,
                "scanManuel": scanManuel
            }
        }, function (err) {
            if (err) {
                res.status(500).send(err);
                console.tag({
                    msg: "CONFIG UPDATE",
                    colors: ["italic", "GREEN", "bold"]
                }).time().file().error(err);
            } else {
                console.tag({
                    msg: "CONFIG UPDATE",
                    colors: ["italic", "GREEN", "bold"]
                }).time().file().info("Config Update Done token = " + name + "-" + societe);
                res.send("Config Update Done");
            }
        });
    });
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (dms) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("codedms", sql.NVarChar, dms).query("select\n                  DCONOMCONDUCTEUR as nom,\n                  DCOSOCCODE as nomsociete,\n                  DCOCODECONDUCTEUR as code,\n                  DCOIMEI as imei\n                  from DMSCONDUCTEUR where DCOTRANSICSCODE = @codedms", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
module.exports = function (idPosition) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("idPosition", sql.Int, idPosition).query("select\n                    OTLNUMCB as numero,\n                    COALESCE(OTLDTDEC, CAST('1900-01-01 00:00' AS DATETIME)) as dateDechargement,\n                    COALESCE(OTLDTCHA, CAST('1900-01-01 00:00' AS DATETIME)) as dateChargement,\n                    COALESCE(OTLDTINV, CAST('1900-01-01 00:00' AS DATETIME)) as dateInventaire,\n                    OTLQUIDEC as quiDechargement,\n                    OTLQUICHA as quiChargement,\n                    OTLQUIINV as quiInventaire,\n                    OTLCLASS as zoneDeQuai\n                    from ORDCOL WHERE OTLOTSID=@idPosition", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
module.exports = function (idPosition, societe) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("idPosition", sql.Int, idPosition).query("select\n                    OTLNUMCB as numero,\n                    COALESCE(OTLDTDEC, CAST('1900-01-01 00:00' AS DATETIME)) as dateDechargement,\n                    COALESCE(OTLDTCHA, CAST('1900-01-01 00:00' AS DATETIME)) as dateChargement,\n                    COALESCE(OTLDTINV, CAST('1900-01-01 00:00' AS DATETIME)) as dateInventaire,\n                    OTLQUIDEC as quiDechargement,\n                    OTLQUICHA as quiChargement,\n                    OTLQUIINV as quiInventaire,\n                    OTLCLASS as zoneDeQuai\n                    from QUAI_" + societe + " WHERE OTLOTSID=@idPosition", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

var Config = __webpack_require__(7);
//chargement exist
module.exports = function (router, console) {
    router.get("/config", function (req, res) {
        var name = req.query.name;
        var societe = req.query.societe;
        var isDefault = req.query.default;
        if (isDefault == "true") {
            Config.findOne({
                isDefault: true,
                societe: societe
            }).then(function (config) {
                if (config != null) {
                    console.tag({
                        msg: "CONFIG",
                        colors: ["italic", "GREEN", "bold"]
                    }).time().file().info("Config get Default " + societe);
                    res.json(config);
                } else {
                    res.send("NotExist");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        } else {
            if (name != undefined) {
                Config.findOne({
                    name: name
                }).then(function (config) {
                    if (config != null) {
                        console.tag({
                            msg: "CONFIG",
                            colors: ["italic", "GREEN", "bold"]
                        }).time().file().info("Config get Name " + name);
                        res.json(config);
                    } else {
                        res.send("NotExist");
                    }
                }).catch(function (err) {
                    if (err) throw err;
                });
            } else {
                if (societe != undefined) {
                    Config.find({
                        societe: societe
                    }).then(function (configs) {
                        if (configs != null) {
                            console.tag({
                                msg: "CONFIG",
                                colors: ["italic", "GREEN", "bold"]
                            }).time().file().info("Config get List " + societe);
                            var arrayConfig = [];
                            configs.forEach(function (item) {
                                arrayConfig.push(item.name);
                            });
                            res.json(arrayConfig);
                        } else {
                            res.send("NotExist");
                        }
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                } else {
                    Config.find({}).then(function (configs) {
                        if (configs != null) {
                            res.json(configs);
                        } else {
                            res.send("NotExist");
                        }
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                }
            }
        }
    });
};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
module.exports = function (idPosition) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("idPosition", sql.Int, idPosition).query("select\n                    OTETEVCODE as code,\n                    OTETEVLIBCL1 as libelle,\n                    OTEDATE as date,\n                    OTEVAL3 as remarque,\n                    OTEVAL1 as information\n                    from ORDEVE\n                    where OTEOTSID = @idPosition\n                    order by OTEID desc", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (router, console) {
    //GET EVENTS
    router.get("/events", function (req, res) {
        new Promise(function (resolve, reject) {
            new sql.Request(conn).query("select\n                    TEVCODE as code,\n                    TEVLIBL1 as libelle,\n                    TEVLIBCL1 as codelib\n                    from OTETYPE where TEVQUAI = 1\n                    and TEVACTIF=1", function (err, recordset) {
                if (err) {
                    console.tag("EVENTS").time().file().error(err);
                    reject(err);
                }
                console.tag("EVENTS").time().file().info("GET EVENTS");
                resolve(recordset);
            });
        }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json({
                error: err
            });
        });
    });
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (num) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("numero", sql.NVarChar, num).query("select TOP 1\n                DMSVOYBDX as numero,\n                DMSCODECHAUFFEUR as dms,\n                DMSDTEXPORT as dateRecu,\n                DMSDATEIMPORT as dateImport\n                from DMSDEALTIS where DMSDEALTIS.DMSVOYBDX = @numero", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 25 */
/***/ function(module, exports) {

module.exports = function (router) {
    //GET ico EVENTS
    router.get("/icoevent/:code", function (req, res) {
        res.sendFile("/usr/project/Horizon/icoevents/" + req.params.code + "_50.png");
        // res.sendFile(`${__dirname}/icoevents/${req.params.code}_50.png`);
        // res.sendFile(`${req.params.code}_50.png`, { root: "/Users/eXtRa/Documents/Dev/Horizon/icoevents"});
    });
};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (code) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("nom", sql.NVarChar, code).query("select top 3\n                      DMEID as id,\n                      DMEMESSAGE as message,\n                      DMEDATERECU as dateRecu\n                      from DMSMESSAGE where DMSMESSAGE.DMECODECHAUF = @nom\n                      and DMETYPE = 5\n                      order by DMSMESSAGE.DMEDATEC desc", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
var s = "select\n            POS.OTSID as idPosition,\n            POS.OTSNUM as numPosition,\n            POS.OTSREF as refClient,\n            POS.OTSCOL as nbColis,\n            POS.OTSPAL as nbPalette,\n            POS.OTSPDS as poids,\n            COALESCE(POS.OTSLONG, 0) as ml,\n            COALESCE(POS.OTSDIV2, 0) as col,\n            COALESCE(POS.OTSUNI03, 0) as colisSurPal,\n            COALESCE(POS.OTSDTLIM, CAST('1900-01-01 00:00' AS DATETIME)) as dateImpLiv,\n            POS.OTSTIENOM as clientNom,\n            POS.OTSREMITTIENOM as expediteurNom,\n            POS.OTSREMITADR1 as expediteurAdresse,\n            POS.OTSREMITVILLIB as expediteurVille,\n            POS.OTSREMITVILCP as expediteurCp,\n            POS.OTSTIENOM as chargementNom,\n            POS.OTSDEPADR1 as chargementAdresse,\n            POS.OTSDEPUSRVILLIB as chargementVille,\n            POS.OTSDEPUSRVILCP as chargementCp,\n            POS.OTSARRNOM as livraisonNom,\n            POS.OTSARRADR1 as livraisonAdresse,\n            POS.OTSARRUSRVILLIB as livraisonVille,\n            POS.OTSARRUSRVILCP as livraisonCp,\n            QUALIBL1 AS zoneQuaiTheorique";
module.exports = function (num, societe) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("numColis", sql.NVarChar, num).query(s + " from dbo.ORDRE as POS, dbo.ORDCOL as COL ,  QUAI,TOURNEEVILLE\n                where POS.OTSID = COL.OTLOTSID\n                AND COL.OTLNUMCB=@numColis\n                AND POS.OTSSOCCODE like '" + societe + "%'\n                AND  otsarrvilid*= TOUVILID AND OTSVPECODE*=QUAVTOCODE and QUASOCCODE='" + societe + "';", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (num, societe) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("numColis", sql.NVarChar, num).query("select\n                          OTSID as idPosition,\n                          OTSNUM as numPosition,\n                          OTSREF as refClient,\n                          OTSCOL as nbColis,\n                          OTSPAL as nbPalette,\n                          OTSPDS as poids,\n                          COALESCE(OTSLONG, 0) as ml,\n                          COALESCE(OTSDIV2, 0) as col,\n                          COALESCE(OTSUNI03, 0) as colisSurPal,\n                          COALESCE(OTSDTLIM, CAST('1900-01-01 00:00' AS DATETIME)) as dateImpLiv,\n                          OTSTIENOM as clientNom,\n                          OTSREMITTIENOM as expediteurNom,\n                          OTSREMITADR1 as expediteurAdresse,\n                          OTSREMITVILLIB as expediteurVille,\n                          OTSREMITVILCP as expediteurCp,\n                          OTSTIENOM as chargementNom,\n                          OTSDEPADR1 as chargementAdresse,\n                          OTSDEPUSRVILLIB as chargementVille,\n                          OTSDEPUSRVILCP as chargementCp,\n                          OTSARRNOM as livraisonNom,\n                          OTSARRADR1 as livraisonAdresse,\n                          OTSARRUSRVILLIB as livraisonVille,\n                          OTSARRUSRVILCP as livraisonCp,\n                          QUALIBL1 as zoneDeQuaiTheorique\n                          from QUAI_" + societe + "\n                          where OTLNUMCB=@numColis;", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
var s = "select\n            POS.OTSID as idPosition,\n            POS.OTSNUM as numPosition,\n            POS.OTSREF as refClient,\n            POS.OTSCOL as nbColis,\n            POS.OTSPAL as nbPalette,\n            POS.OTSPDS as poids,\n            COALESCE(POS.OTSLONG, 0) as ml,\n            COALESCE(POS.OTSDIV2, 0) as col,\n            COALESCE(POS.OTSUNI03, 0) as colisSurPal,\n            COALESCE(POS.OTSDTLIM, CAST('1900-01-01 00:00' AS DATETIME)) as dateImpLiv,\n            POS.OTSTIENOM as clientNom,\n            POS.OTSREMITTIENOM as expediteurNom,\n            POS.OTSREMITADR1 as expediteurAdresse,\n            POS.OTSREMITVILLIB as expediteurVille,\n            POS.OTSREMITVILCP as expediteurCp,\n            POS.OTSTIENOM as chargementNom,\n            POS.OTSDEPADR1 as chargementAdresse,\n            POS.OTSDEPUSRVILLIB as chargementVille,\n            POS.OTSDEPUSRVILCP as chargementCp,\n            POS.OTSARRNOM as livraisonNom,\n            POS.OTSARRADR1 as livraisonAdresse,\n            POS.OTSARRUSRVILLIB as livraisonVille,\n            POS.OTSARRUSRVILCP as livraisonCp,\n            QUALIBL1 AS zoneQuaiTheorique";
module.exports = function (num, societe) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("numColis", sql.NVarChar, num).query(s + " from dbo.ORDRE as POS, dbo.ORDCOL as COL ,  QUAI,TOURNEEVILLE\n                where POS.OTSID = COL.OTLOTSID\n                AND COL.OTLNUMCB=@numColis\n                AND POS.OTSSOCCODE like '" + societe + "%'\n                AND  otsarrvilid*= TOUVILID AND OTSVPECODE*=QUAVTOCODE and QUASOCCODE='" + societe + "'\n                UNION " + s + " from dbo.ORDRE as POS, dbo.ORDCOL as COL,QUAI,TOURNEEVILLE\n                where POS.OTSID = COL.OTLOTSID\n                AND otsarrvilid*= TOUVILID AND OTSVPECODE*=QUAVTOCODE and QUASOCCODE='" + societe + "'\n                AND POS.OTSNUM=@numColis\n                AND POS.OTSSOCCODE like '" + societe + "%';", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 30 */
/***/ function(module, exports) {

module.exports = function (num, storage) {
    return new Promise(function (resolve, reject) {
        try {
            storage.values().forEach(function (pos) {
                pos.codebarre.forEach(function (cb) {
                    if (cb.numero === num) {
                        resolve(pos);
                    }
                });
            });
            resolve(undefined);
        } catch (e) {
            reject(e);
        }
    });
};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (num, societe) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("numColis", sql.NVarChar, num).query("select\n                          OTSID as idPosition,\n                          OTSNUM as numPosition,\n                          OTSREF as refClient,\n                          OTSCOL as nbColis,\n                          OTSPAL as nbPalette,\n                          OTSPDS as poids,\n                          COALESCE(OTSLONG, 0) as ml,\n                          COALESCE(OTSDIV2, 0) as col,\n                          COALESCE(OTSUNI03, 0) as colisSurPal,\n                          COALESCE(OTSDTLIM, CAST('1900-01-01 00:00' AS DATETIME)) as dateImpLiv,\n                          OTSTIENOM as clientNom,\n                          OTSREMITTIENOM as expediteurNom,\n                          OTSREMITADR1 as expediteurAdresse,\n                          OTSREMITVILLIB as expediteurVille,\n                          OTSREMITVILCP as expediteurCp,\n                          OTSTIENOM as chargementNom,\n                          OTSDEPADR1 as chargementAdresse,\n                          OTSDEPUSRVILLIB as chargementVille,\n                          OTSDEPUSRVILCP as chargementCp,\n                          OTSARRNOM as livraisonNom,\n                          OTSARRADR1 as livraisonAdresse,\n                          OTSARRUSRVILLIB as livraisonVille,\n                          OTSARRUSRVILCP as livraisonCp,\n                          QUALIBL1 as zoneQuaiTheorique\n                          from QUAI_" + societe + "\n                          where OTLNUMCB=@numColis\n                          UNION\n                          select\n                          OTSID as idPosition,\n                          OTSNUM as numPosition,\n                          OTSREF as refClient,\n                          OTSCOL as nbColis,\n                          OTSPAL as nbPalette,\n                          OTSPDS as poids,\n                          COALESCE(OTSLONG, 0) as ml,\n                          COALESCE(OTSDIV2, 0) as col,\n                          COALESCE(OTSUNI03, 0) as colisSurPal,\n                          COALESCE(OTSDTLIM, CAST('1900-01-01 00:00' AS DATETIME)) as dateImpLiv,\n                          OTSTIENOM as clientNom,\n                          OTSREMITTIENOM as expediteurNom,\n                          OTSREMITADR1 as expediteurAdresse,\n                          OTSREMITVILLIB as expediteurVille,\n                          OTSREMITVILCP as expediteurCp,\n                          OTSTIENOM as chargementNom,\n                          OTSDEPADR1 as chargementAdresse,\n                          OTSDEPUSRVILLIB as chargementVille,\n                          OTSDEPUSRVILCP as chargementCp,\n                          OTSARRNOM as livraisonNom,\n                          OTSARRADR1 as livraisonAdresse,\n                          OTSARRUSRVILLIB as livraisonVille,\n                          OTSARRUSRVILCP as livraisonCp,\n                          QUALIBL1 as zoneQuaiTheorique\n                          from QUAI_" + societe + "\n                          WHERE OTSNUM=@numColis;", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
var moment = __webpack_require__(2);

module.exports = function (code) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("code", sql.NVarChar, code).query("select\n                      OTPTRSCODE as type,\n                      count(distinct(otpid)) as nbPosition ,\n                      count(distinct(dbo.DMSSUIVILIV.DMSUIVIOTSNUM)) AS nbFait\n                      from DMSCONDUCTEUR , voyage , ordpla , DMSSUIVILIV\n                      where dbo.DMSSUIVILIV.DMSSUIVIVOYBDX=voybdx\n                      and dbo.VOYAGE.VOYID=otpvoyid\n                      and dbo.DMSSUIVILIV.DMSUIVIOTSNUm=*otpotsnum\n                      and VOYCHSALCODE = dbo.DMSCONDUCTEUR.DCOCODECONDUCTEUR\n                      AND datediff(day, VOYDEPDTDEB, '" + moment().format("MM/DD/YYYY") + "') = 0\n                      AND dbo.DMSCONDUCTEUR.DCOCODECONDUCTEUR = @code\n                      group by  dcocodeconducteur,OTPTRSCODE", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
var UserDcs = __webpack_require__(5);

//GET SALARIE
module.exports = function (router, console) {
    router.get("/salarie/:val", function (req, res) {
        new sql.Request(conn).input("val", sql.NVarChar, req.params.val).query("SELECT TOP 1 SALCODE, SALSOCCODE FROM SALARIE WHERE SALCODE=@val OR SALNUMPERMIS=@val", function (err, recordset) {
            if (err) {
                console.tag("SALARIE").time().file().error(err);
                res.status(500).send(err);
            }
            if (recordset.length === 0) {
                console.tag("SALARIE").time().file().info(req.params.val + " No result");
                res.status(204).send("No result");
            } else {
                UserDcs.findOne({
                    code: recordset[0].SALCODE
                }, function (err, user) {
                    if (err) throw err;
                    if (user != null) {
                        // if (user.connected) {
                        //     console.tag("SALARIE").time().file().info(`${recordset[0].SALCODE} already connected`);
                        //     res.status(409).send("User already connected");
                        // }else {
                        console.tag("SALARIE").time().file().info(req.params.val);
                        res.status(200).json(recordset);
                        user.lastConn = new Date();
                        user.connected = true;
                        user.save(function (err) {
                            if (err) throw err;
                        });
                        // }
                    } else {
                        console.tag("SALARIE").time().file().info(req.params.val);
                        res.status(200).json(recordset);

                        var newuser = new UserDcs({
                            code: recordset[0].SALCODE,
                            societe: recordset[0].SALSOCCODE,
                            connected: true
                        });
                        newuser.save(function (err) {
                            if (err) throw err;
                        });
                    }
                });
            }
        });
    });
};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);
var moment = __webpack_require__(2);

module.exports = function (dms) {
    return new Promise(function (resolve, reject) {
        new sql.Request(conn).input("dms", sql.NVarChar, dms).query("SELECT\n                      DMSOTSNUM as numeroPos,\n                      DMSUIVICODEANO as codeEvent,\n                      DMSNOMCLIENT as clientNom\n                      FROM DMSSUIVILIV,DMSDEALTIS\n                      WHERE DMSOTSNUM = DMSUIVIOTSNUM\n                      AND DMSVOYBDX = DMSSUIVIVOYBDX\n                      AND DMSCODECHAUFFEUR = @dms\n                      AND datediff(day, DMSUIVIDATE, '" + moment().format("MM/DD/YYYY") + "') = 0\n                      ORDER BY DMSUIVIDATE desc", function (err, recordset) {
            if (err) {
                reject(err);
            }
            resolve(recordset);
        });
    });
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (router, console) {
    //GET ZONE
    router.get("/zone/:val", function (req, res) {
        new Promise(function (resolve, reject) {
            new sql.Request(conn).input("val", sql.NVarChar, req.params.val).query("SELECT\n                    QUACODEL1 as codeZone,\n                    QUALIBL1 as libZone\n                    FROM QUAI\n                    WHERE QUASOCCODE LIKE '" + req.query.societe + "'\n                    AND QUACODEL1 = @val", function (err, recordset) {
                if (err) {
                    console.tag("ZONE").time().file().error(err);
                    reject(err);
                }
                console.tag("ZONE").time().file().info(req.params.val);
                resolve(recordset);
            });
        }).then(function (result) {
            res.json(result[0]);
        }).catch(function (err) {
            res.json({
                error: err
            });
        });
    });
};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (router, console) {
    //GET ZONES
    router.get("/zones/:soc", function (req, res) {
        new Promise(function (resolve, reject) {
            new sql.Request(conn).input("val", sql.NVarChar, req.params.soc).query("SELECT\n                    QUACODEL1 as codeZone,\n                    QUALIBL1 as libZone\n                    FROM QUAI\n                    WHERE QUASOCCODE LIKE @val", function (err, recordset) {
                if (err) {
                    console.tag("ZONE").time().file().error(err);
                    reject(err);
                }
                console.tag("ZONES").time().file().info(req.params.soc);
                resolve(recordset);
            });
        }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json({
                error: err
            });
        });
    });
};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

var postEventAnd = __webpack_require__(6);
var moment = __webpack_require__(2);
var traitColis = __webpack_require__(10);

module.exports = function (router, console, storage) {
    //POST EVENT
    router.post("/event", function (req, res) {
        postEventAnd(req.query.codeEvent, req.query.libEvent, req.query.remarque, req.query.user, req.query.idPosition).then(function (data) {
            console.log("Event post successfully " + data);
            res.status(200).send("Event post successfully");
        }).catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
        var sch = storage.values().find(function (o) {
            return o.idPosition == req.query.idPosition;
        });

        if (sch != undefined) {
            sch.evenement.push({
                "information": "",
                "remarque": req.query.remarque,
                "date": moment().format(),
                "libelle": req.query.libEvent,
                "code": req.query.codeEvent,
                "source": "DCS"
            });

            storage.setItem(sch.numPosition, sch);

            if (req.query.codeEvent == "COMPLET") {
                if (req.query.zone != undefined) {
                    sch.codebarre.forEach(function (colis) {
                        traitColis(colis.numero, "inventaire", req.query.user, req.query.zone, storage);
                    });
                } else {
                    sch.codebarre.forEach(function (colis) {
                        traitColis(colis.numero, "dechargement", req.query.user, "", storage);
                    });
                }
            }
        }
    });
};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

var fs = __webpack_require__(51);
var Client = __webpack_require__(52);

var connectionProperties = {
    host: "10.1.2.75",
    user: "DMS",
    password: "Linuxr00tn"
};

module.exports = function (router, console) {
    //POST IMAGE
    router.post("/image", function (req, res) {
        var c = new Client();
        var fstream = void 0;
        req.pipe(req.busboy);
        req.busboy.on("file", function (fieldname, file, filename) {
            console.tag("UPLOAD_IMG").time().file().info("Start upload " + filename);
            fstream = fs.createWriteStream("images/" + filename);
            file.pipe(fstream);

            fstream.on("error", function (err) {
                console.tag({
                    msg: "UPLOAD_IMG",
                    colors: ["blue", "bold"]
                }).time().file().error(err);
                res.status(500).send(err);
            });

            fstream.on("finish", function () {
                console.tag({
                    msg: "UPLOAD_IMG",
                    colors: ["blue", "bold"]
                }).time().file().info("Finish upload " + filename);

                c.on("ready", function () {
                    c.put("images/" + filename, filename.replace(".jpg", "-1_1.jpg"), function (err) {
                        if (err) throw err;
                        console.log("put de " + filename);
                        c.end();
                    });
                });

                c.connect(connectionProperties);
                res.end();
            });
        });
    });
};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(2);
var console = process.console;
var postEventAnd = __webpack_require__(6);

module.exports = function (num, action, storage) {
    return new Promise(function (resolve, reject) {
        try {
            storage.values().forEach(function (pos) {
                pos.codebarre.forEach(function (cb) {
                    if (cb.numero === num) {
                        //is all colis flashe today in this action ?
                        var i = 0;
                        pos.codebarre.forEach(function (colis) {
                            switch (action) {
                                case "chargement":
                                    if (moment(colis.dateChargement).isSame(moment().format(), "day")) {
                                        i++;
                                    }
                                    break;
                                case "dechargement":
                                    if (moment(colis.dateDechargement).isSame(moment().format(), "day")) {
                                        i++;
                                    }
                                    break;
                                case "inventaire":
                                    if (moment(colis.dateInventaire).isSame(moment().format(), "day")) {
                                        i++;
                                    }
                                    break;
                            }
                        });

                        if (i == pos.codebarre.length) {
                            switch (action) {
                                case "chargement":
                                    //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                    if (pos.ChargementEventDoneAt == undefined || !moment(pos.ChargementEventDoneAt).isSame(moment().format(), "day")) {
                                        pos.ChargementEventDoneAt = moment().format();
                                        // TODO creation de l'event
                                        console.tag({
                                            msg: "EVENT_FULL | " + action,
                                            colors: ["magenta", "bgYellow", "bold"]
                                        }).time().file().info("Event full " + action + " for " + num);
                                    } else {
                                        console.tag({
                                            msg: "EVENT_FULL | " + action,
                                            colors: ["bgRed", "bold"]
                                        }).time().file().info("Event full " + action + " already done today for " + num);
                                    }
                                    break;
                                case "dechargement":
                                    //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                    if (pos.DechargementEventDoneAt == undefined || !moment(pos.DechargementEventDoneAt).isSame(moment().format(), "day")) {
                                        pos.DechargementEventDoneAt = moment().format();
                                        //si il a eu un autre event ne rien faire
                                        var sch = pos.evenement.find(function (o) {
                                            return o.source == "DCS" && o.code.indexOf("AAR") > -1;
                                        });
                                        console.log(sch);
                                        if (sch == undefined) {
                                            postEventAnd("AARCFM", "", "", "", pos.idPosition);
                                        }

                                        console.tag({
                                            msg: "EVENT_FULL | " + action,
                                            colors: ["magenta", "bgYellow", "bold"]
                                        }).time().file().info("Event full " + action + " for " + num);
                                    } else {
                                        console.tag({
                                            msg: "EVENT_FULL | " + action,
                                            colors: ["bgRed", "bold"]
                                        }).time().file().info("Event full " + action + " already done today for " + num);
                                    }
                                    break;
                                case "inventaire":
                                    //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                    if (pos.InventaireEventDoneAt == undefined || !moment(pos.InventaireEventDoneAt).isSame(moment().format(), "day")) {
                                        pos.InventaireEventDoneAt = moment().format();

                                        var _sch = pos.evenement.find(function (o) {
                                            return o.code == "AARCFM";
                                        });

                                        if (_sch == undefined) {
                                            postEventAnd("AARCFM", "", "", "", pos.idPosition);
                                        }

                                        console.tag({
                                            msg: "EVENT_FULL | " + action,
                                            colors: ["magenta", "bgYellow", "bold"]
                                        }).time().file().info("Event full " + action + " for " + num);
                                    } else {
                                        console.tag({
                                            msg: "EVENT_FULL | " + action,
                                            colors: ["bgRed", "bold"]
                                        }).time().file().info("Event full " + action + " already done today for " + num);
                                    }
                                    break;
                            }
                            storage.setItem(pos.numPosition, pos);
                        }
                        resolve();
                    }
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

var sql = __webpack_require__(0);
var conn = __webpack_require__(1);

module.exports = function (numColis, action, user, zone) {
    return new Promise(function (resolve, reject) {
        var req = new sql.Request(conn).input("numColis", sql.NVarChar, numColis).input("user", sql.NVarChar, user);
        switch (action) {
            case "chargement":
                req.query("UPDATE ORDCOL\n                    SET\n                    OTLDTCHA = GETDATE(),\n                    OTLQUICHA = @user\n                    where OTLNUMCB = @numColis", function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
                break;
            case "dechargement":
                req.input("zone", sql.NVarChar, zone);
                req.query("UPDATE ORDCOL\n                        SET\n                        OTLDTDEC = GETDATE(),\n                        OTLQUIDEC = @user,\n                        OTLCLASS = @zone\n                        where OTLNUMCB = @numColis", function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
                break;
            case "inventaire":
                req.input("zone", sql.NVarChar, zone);
                req.query("UPDATE ORDCOL\n                            SET\n                            OTLDTINV = GETDATE(),\n                            OTLQUIINV = @user,\n                            OTLCLASS = @zone\n                            where OTLNUMCB = @numColis", function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
                break;
            default:
        }
    });
};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

var moment = __webpack_require__(2);
var _ = __webpack_require__(55);
var postEventAnd = __webpack_require__(6);

module.exports = function (num, action, user, zone, storage) {
    return new Promise(function (resolve, reject) {
        try {
            storage.values().forEach(function (pos) {
                pos.codebarre.forEach(function (cb) {
                    if (cb.numero === num) {
                        switch (action) {
                            case "chargement":
                                cb.dateChargement = moment().format();
                                cb.quiChargement = user;
                                break;
                            case "dechargement":
                                cb.dateDechargement = moment().format();
                                cb.quiDechargement = user;
                                cb.zoneDeQuai = zone;
                                break;
                            case "inventaire":
                                var schColis = _.find(pos.codebarre, function (o) {
                                    return moment(o.dateInventaire).isSame(moment().format(), "day") && o.zoneDeQuai == zone;
                                });
                                if (schColis == undefined) {
                                    postEventAnd("INVQUAI", "INVQUAI", zone, user, pos.idPosition);
                                    // .then((data)=>{
                                    //     console.log(data);
                                    // }).catch((err) =>{
                                    //     console.log(err);
                                    // });
                                }

                                cb.dateInventaire = moment().format();
                                cb.quiInventaire = user;
                                cb.zoneDeQuai = zone;
                                break;
                        }
                        resolve(pos);
                    }
                });
            });
            resolve(undefined);
        } catch (e) {
            reject(e);
        }
    });
};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

var Chargement = __webpack_require__(4);

//chargement exist
module.exports = function (router) {
    router.get("/userInChargement/:token", function (req, res) {
        var token = req.params.token;
        Chargement.findOne({
            token: token
        }).then(function (charg) {
            if (charg != null) {
                res.json(charg.users);
            } else {
                res.send("NotExist");
            }
        }).catch(function (err) {
            if (err) throw err;
        });
    });
};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

var Chargement = __webpack_require__(4);

module.exports = function (router) {

    //GET STORECHARG
    router.get("/storeCharg", function (req, res) {
        // get all the users
        Chargement.find({}, function (err, chargs) {
            if (err) throw err;
            res.json(chargs);
        });
    });
};

/***/ },
/* 44 */
/***/ function(module, exports) {

module.exports = function (router, console, storePos) {
    //GET STOREPOS
    router.get("/storePos", function (req, res) {
        res.json(storePos.values());
    });

    // //GET STORECHARG
    // router.get("/storeCharg", (req, res) => {
    //     res.json(storeCharg.values());
    // });

    //clear STOREPOS
    router.get("/storePos/clear", function (req, res) {
        storePos.clear().then(function (err) {
            if (err) {
                res.send(err);
            }
            console.tag("STOREPOS").time().file().info("CLEAR");
            res.send("ok");
        });
    });

    //REMOVE STOREPOS
    router.get("/storePos/remove/:numPosition", function (req, res) {
        storePos.removeItem(req.params.numPosition).then(function (err) {
            if (err) {
                res.send(err);
            }
            console.tag("STOREPOS").time().file().info("Remove " + req.params.numPosition);
            res.send("ok");
        });
    });
};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

var getGroupage = __webpack_require__(24);
var getChauffeur = __webpack_require__(18);
var getMessageAdmin = __webpack_require__(26);
var getSuiviDms = __webpack_require__(34);
var getProgressDms = __webpack_require__(32);

module.exports = function (router, console) {
    //GET INFO GROUPAGE
    var dataGrp = {
        numero: 0,
        societe: "",
        chauffeur: {
            nom: "name",
            code: "",
            imei: 0,
            dms: "smart_"
        },
        dateImport: "",
        dateRecu: "",
        message: [],
        position: [],
        progressBar: []
    };
    router.get("/infogroupage/:numero", function (req, res) {
        getGroupage(req.params.numero).then(function (result) {
            dataGrp.numero = result[0].numero;
            dataGrp.chauffeur.dms = result[0].dms;
            dataGrp.dateImport = result[0].dateImport;
            dataGrp.dateRecu = result[0].dateRecu;
            return getChauffeur(result[0].dms);
        }).then(function (result) {
            dataGrp.chauffeur.nom = result[0].nom;
            dataGrp.chauffeur.code = result[0].code;
            dataGrp.chauffeur.imei = result[0].imei;
            dataGrp.societe = result[0].nomsociete;
            return getMessageAdmin(result[0].code);
        }).then(function (result) {
            dataGrp.message = result;
            return getSuiviDms(dataGrp.chauffeur.dms);
        }).then(function (result) {
            dataGrp.position = result;
            getProgressDms(dataGrp.chauffeur.code).then(function (result) {
                dataGrp.progressBar = result;
                res.json(dataGrp);
                console.tag({
                    msg: "INFOGRP",
                    colors: ["italic", "blue", "bold"]
                }).time().file().info(req.params.numero);
            });
        }).catch(function (err) {
            console.error({
                msg: "INFOGRP",
                colors: ["italic", "red", "bold"]
            }).time().file().info(req.params.numero);
            res.json({
                error: err
            });
        });
    });
};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

var getPosProdTable = __webpack_require__(29);
var getPosOnlyColisProdTable = __webpack_require__(27);
var getPosTempTable = __webpack_require__(31);
var getPosOnlyColisTempTable = __webpack_require__(28);
var getPosStorage = __webpack_require__(30);
var getColisProdTable = __webpack_require__(19);
var getColisTempTable = __webpack_require__(20);
var getEventProd = __webpack_require__(22);
var traitColis = __webpack_require__(10);

//GET ACTION
module.exports = function (router, console, storage) {
    router.get("/:action/:user/:numColis", function (req, res) {
        //is in storage
        var newStorage = {};
        getPosStorage(req.params.numColis, storage).then(function (resStore) {
            if (resStore != undefined) {
                console.tag({
                    msg: "STORAGE | " + req.params.action,
                    colors: ["italic", "grey", "bold"]
                }).time().file().info({
                    num: resStore.numPosition,
                    user: req.params.user
                });
                if (req.params.action != "infocolis") {
                    traitColis(req.params.numColis, req.params.action, req.params.user, req.query.zone, storage);
                }
                res.json(resStore);
            } else {
                // is position in tempTable
                if (req.params.action == "chargement") {
                    return getPosOnlyColisTempTable(req.params.numColis, req.query.societe);
                } else {
                    return getPosTempTable(req.params.numColis, req.query.societe);
                }
            }
        }).then(function (resPos) {
            if (resPos != undefined) {
                if (resPos.length == 0) {
                    console.tag({
                        msg: "TEMP_DB | " + req.params.action,
                        colors: ["italic", "magenta", "bold"]
                    }).time().file().info("no result " + req.params.numColis + " par " + req.params.user);
                    // is position in prodTable
                    if (req.params.action == "chargement") {
                        return getPosOnlyColisProdTable(req.params.numColis, req.query.societe);
                    } else {
                        return getPosProdTable(req.params.numColis, req.query.societe);
                    }
                } else {
                    newStorage = resPos[0];
                    //load colis sql temp
                    return getColisTempTable(resPos[0].idPosition, req.query.societe).then(function (resColis) {
                        newStorage.codebarre = resColis;
                        newStorage.societe = req.query.societe;
                        return getEventProd(resPos[0].idPosition);
                    }).then(function (resEvent) {
                        newStorage.evenement = resEvent;
                        //storage de la position
                        storage.setItem(newStorage.numPosition, newStorage).then(function () {
                            if (req.params.action != "infocolis") {
                                traitColis(req.params.numColis, req.params.action, req.params.user, req.query.zone, storage);
                            }
                        });
                        console.tag({
                            msg: "TEMP_DB | " + req.params.action,
                            colors: ["italic", "magenta", "bold"]
                        }).time().file().info({
                            num: req.params.numColis,
                            user: req.params.user
                        });
                        res.status(200).json(newStorage);
                    }).catch(function (err) {
                        res.status(500).json(err);
                    });
                }
            }
        }).then(function (resPos) {
            if (resPos != undefined) {
                if (resPos.length == 0) {
                    console.tag({
                        msg: "PROD_DB | " + req.params.action,
                        colors: ["italic", "blue", "bold"]
                    }).time().file().info("no result " + req.params.numColis + " par " + req.params.user);
                    res.status(200).json(resPos);
                    throw "finish";
                } else {
                    newStorage = resPos[0];
                    //load colis sql prod
                    getColisProdTable(resPos[0].idPosition).then(function (resColis) {
                        newStorage.codebarre = resColis;
                        newStorage.societe = req.query.societe;
                        return getEventProd(resPos[0].idPosition);
                    }).then(function (resEvent) {
                        newStorage.evenement = resEvent;
                        //storage de la position
                        storage.setItem(newStorage.numPosition, newStorage).then(function () {
                            if (req.params.action != "infocolis") {
                                traitColis(req.params.numColis, req.params.action, req.params.user, req.query.zone, storage);
                            }
                        });
                        console.tag({
                            msg: "PROD_DB | " + req.params.action,
                            colors: ["italic", "blue", "bold"]
                        }).time().file().info({
                            num: req.params.numColis,
                            user: req.params.user
                        });
                        res.status(200).json(newStorage);
                    });
                }
            }
        }).catch(function (err) {
            console.tag({
                msg: "ERR | " + req.params.numColis,
                colors: ["italic", "red", "bold"]
            }).time().file().info(err);
        });
    });
};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

var UserDcs = __webpack_require__(5);
var Chargement = __webpack_require__(4);

var _require = __webpack_require__(8),
    Position = _require.Position;

var sendMail = __webpack_require__(9);
var chargementErreur = __webpack_require__(14);
var moment = __webpack_require__(2);
var request = __webpack_require__(11);

//SOCKET
module.exports = function (io, console, storePos) {
    io.on("connection", function (socket) {
        console.tag("SOCKET").time().file().info("Connect! " + socket.id);
        socket.on("handshake", function (handshake) {
            if (handshake.plateforme == "smartphone") {
                UserDcs.findOne({
                    code: handshake.user
                }, function (err, user) {
                    // io.to(user.socketId).emit("logout");
                    console.tag("SOCKET").time().file().info(socket.id + " set tp " + handshake.user);
                    user.socketId = socket.id;
                    var currentDate = new Date();
                    user.lastConn = currentDate;
                    console.tag("SOCKET").time().file().info("USER : " + handshake.user + " CONN");
                    socket.join("smart");
                    io.to("desktop").emit("newSmart", user);
                    user.save(function (err) {
                        if (err) throw err;
                    });
                });
            } else {
                socket.join("desktop");
                UserDcs.find({ connected: true }, function (err, users) {
                    if (err) throw err;
                    socket.emit("listSmart", users);
                });
            }
        });

        socket.on("closeHandShake", function (user) {
            console.tag("SOCKET").time().file().info("closeHandShake " + socket.id);
            UserDcs.findOne({
                code: user
            }, function (err, user) {
                if (err) throw err;
                user.connected = false;
                console.tag("SOCKET").time().file().info("USER : " + user.code + " DISCONN");
                io.to("desktop").emit("suppSmart", user.code);
                user.save(function (err) {
                    if (err) throw err;
                });
            });
        });

        socket.on("joinChargement", function (token, user) {
            socket.join(token);
            Chargement.findOne({
                token: token
            }).then(function (charg) {
                if (charg != null) {
                    charg.logs.push({
                        type: "conn",
                        user: user,
                        date: moment().format()
                    });
                    var s = charg.users.find(function (u) {
                        return u.user === user;
                    });
                    console.log(s);
                    if (s != undefined) {
                        Chargement.update({
                            token: token
                        }, {
                            $pull: {
                                users: {
                                    user: user
                                }
                            }
                        }, function (err, val) {
                            console.log(val);
                        });
                    }
                    charg.users.push({
                        user: user,
                        date: moment().format()
                    });
                    charg.save(function (err) {
                        if (err) throw err;
                        socket.emit("joinChargement_Notif");
                        console.tag("SOCKET").time().file().info("joinChargement " + token + " / " + user);
                    });
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("leaveChargement", function (token, user) {
            socket.leave(token);
            Chargement.findOne({
                token: token
            }).then(function (charg) {
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
                    }, function (err, val) {
                        console.log(val);
                    });
                    socket.emit("leaveChargement_Notif");
                    console.tag("SOCKET").time().file().info("leaveChargement " + token + " / " + user);
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("CHA.addPos", function (token, numpos, user) {
            Chargement.findOne({
                token: token
            }).then(function (charg) {
                if (charg != null) {
                    storePos.getItem(numpos).then(function (pos) {
                        var newPos = new Position(pos);
                        newPos.save(function (err) {
                            if (err) {
                                console.tag("SOCKET").time().file().error("CHA.addPos Position en double " + numpos + " / " + user);
                            }
                        });

                        charg.positions.unshift(newPos.numPosition);
                        charg.logs.push({
                            type: "addPos",
                            user: user,
                            date: moment().format()
                        });
                        charg.save(function (err) {
                            if (err) throw err;
                            console.tag("SOCKET").time().file().info("CHA.addPos UPDATE " + token + " / " + numpos + " / " + user);
                        });
                        socket.broadcast.to(token).emit("CHA.addPos_Notif", numpos);
                    });
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("CHA.addColisFictif", function (token, numPosition, nbColisFictif, user) {
            Chargement.findOne({
                token: token
            }).then(function (charg) {
                if (charg != null) {
                    Position.findOne({
                        numPosition: numPosition
                    }).then(function (pos) {
                        if (pos != null) {
                            pos.nbColisFictif = nbColisFictif;
                            pos.save(function (err) {
                                if (err) throw err;
                                console.tag("SOCKET").time().file().info("CHA.addColisFictif UPDATE POS " + numPosition + " / " + user);
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
                    charg.save(function (err) {
                        if (err) throw err;
                        console.tag("SOCKET").time().file().info("CHA.addColisFictif UPDATE CHARG " + token + " / " + numPosition + " / " + user);
                    });
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("CHA.addCol", function (token, numPosition, numColis, user) {
            Chargement.findOne({
                token: token
            }).then(function (charg) {
                if (charg != null) {
                    charg.logs.push({
                        type: "addCol " + numColis,
                        user: user,
                        date: moment().format()
                    });

                    Position.update({
                        numPosition: numPosition,
                        "codebarre.numero": numColis
                    }, {
                        $set: {
                            "codebarre.$.isScanner": true
                        }
                    }, function (err, result) {
                        console.log(result);
                    });

                    charg.save(function (err) {
                        if (err) throw err;
                        console.tag("SOCKET").time().file().info("CHA.addCol UPDATE " + token + " / " + numColis + " / " + user);
                    });
                    socket.broadcast.to(token).emit("CHA.addCol_Notif", numColis);
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("CHA.deletePos", function (token, index, user) {
            Chargement.findOne({
                token: token
            }).then(function (charg) {
                if (charg != null) {
                    socket.broadcast.to(token).emit("CHA.deletePos_Notif", charg.positions[index].numPosition);
                    charg.logs.push({
                        type: "deletePos",
                        posnum: charg.positions[index].numPosition,
                        user: user,
                        date: moment().format()
                    });
                    console.tag("SOCKET").time().file().info("CHA.deletePos Delete de  " + token + " / " + charg.positions[index].numPosition + " / " + user);
                    charg.positions.splice(index, 1);
                    charg.save(function (err) {
                        if (err) throw err;
                    });
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("CHA.SwapPos", function (token, indexA, indexB, user) {
            Chargement.findOne({
                token: token
            }).then(function (charg) {
                if (charg != null) {
                    socket.broadcast.to(token).emit("CHA.SwapPos_Notif", {
                        numA: charg.positions[indexA].numPosition,
                        numB: charg.positions[indexB].numPosition
                    });
                    charg.logs.push({
                        type: "SwapPos",
                        posnum: charg.positions[indexA].numPosition + " > " + charg.positions[indexB].numPosition,
                        user: user,
                        date: moment().format()
                    });
                    console.tag("SOCKET").time().file().info("CHA.SwapPos Swap de  " + token + " / " + charg.positions[indexA].numPosition + " et " + charg.positions[indexB].numPosition + " / " + user);
                    charg.positions.forEach(function (item) {
                        console.log(item.numPosition);
                    });
                    var b = charg.positions[indexA];
                    charg.positions[indexA] = charg.positions[indexB];
                    charg.positions[indexB] = b;
                    charg.positions.forEach(function (item) {
                        console.log(item.numPosition);
                    });
                    charg.save(function (err) {
                        if (err) throw err;
                    });
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("CHA.Cloture", function (token, user, zone, commande) {
            Chargement.findOne({
                token: token
            }).then(function (charg) {
                if (charg != null) {
                    socket.broadcast.to(token).emit("CHA.Cloture_Notif");
                    charg.logs.push({
                        type: "Cloture",
                        user: user,
                        date: moment().format()
                    });
                    console.tag("SOCKET").time().file().info("CHA.Cloture Cloture de  " + token + " / " + user);
                    var data = [];
                    JSON.parse(commande).forEach(function (pos) {
                        var newdata = {
                            OTSID: pos.idPosition,
                            OTSNUM: pos.numPosition
                        };
                        data.push(newdata);
                    });
                    console.log({
                        GRPQUIC: user,
                        GRPPORTE: zone,
                        GRPCOMMANDE: data
                    });
                    var options = {
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
                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);
                        console.log(body);
                        if (body != "0") {
                            charg.status = "close";
                            charg.token = token + "_" + body;
                            charg.groupage = body;
                            charg.save(function (err) {
                                if (err) throw err;
                            });
                        } else {
                            charg.status = "erreur";
                            charg.token = token + "_" + moment().format("ddd-Do-kk:mm") + "_err";
                            charg.save(function (err) {
                                if (err) throw err;
                                sendMail(chargementErreur(charg.zone, charg.societe, charg.userCrea));
                            });
                        }
                    });
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });

        socket.on("forcedisconnect", function (user) {
            // console.tag("SOCKET").time().file().info(`Got disconnect! ${socket.id}`);
            UserDcs.findOne({
                code: user
            }, function (err, user) {
                if (err) throw err;
                if (user != null) {
                    user.connected = false;
                    user.save(function (err) {
                        if (err) throw err;
                        console.tag("SOCKET FORCE DISCONN").time().file().info("USER : " + user.code + " FORCE DISCONN");
                        io.to("desktop").emit("suppSmart", user.code);
                        io.to(user.socketId).emit("forcedisconnect_Notif");
                    });
                }
            });
        });

        socket.on("disconnect", function () {
            console.tag("SOCKET").time().file().info("Got disconnect! " + socket.id);
            UserDcs.findOne({
                socketId: socket.id
            }, function (err, user) {
                if (err) throw err;
                if (user != null) {
                    user.connected = false;
                    user.save(function (err) {
                        if (err) throw err;
                        console.tag("SOCKET").time().file().info("USER : " + user.code + " DISCONN");
                        io.to("desktop").emit("suppSmart", user.code);
                    });
                }
            });
        });
    });
};

/***/ },
/* 48 */
/***/ function(module, exports) {

module.exports = require("async");

/***/ },
/* 49 */
/***/ function(module, exports) {

module.exports = require("connect-busboy");

/***/ },
/* 50 */
/***/ function(module, exports) {

module.exports = require("express");

/***/ },
/* 51 */
/***/ function(module, exports) {

module.exports = require("fs");

/***/ },
/* 52 */
/***/ function(module, exports) {

module.exports = require("ftp");

/***/ },
/* 53 */
/***/ function(module, exports) {

module.exports = require("helmet");

/***/ },
/* 54 */
/***/ function(module, exports) {

module.exports = require("http");

/***/ },
/* 55 */
/***/ function(module, exports) {

module.exports = require("lodash");

/***/ },
/* 56 */
/***/ function(module, exports) {

module.exports = require("node-persist");

/***/ },
/* 57 */
/***/ function(module, exports) {

module.exports = require("nodemailer");

/***/ },
/* 58 */
/***/ function(module, exports) {

module.exports = require("scribe-js");

/***/ },
/* 59 */
/***/ function(module, exports) {

module.exports = require("socket.io");

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }
/******/ ]);
//# sourceMappingURL=main.map