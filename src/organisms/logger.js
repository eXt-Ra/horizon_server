"use strict";

const winston = require("winston");
require("winston-daily-rotate-file");
const moment = require("moment");

const timeFormatFn = function () {
    return moment().format("DD.MM.YY-HH:mm:ss");
};

const DCS_Console = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({timestamp: timeFormatFn}),
        new (winston.transports.DailyRotateFile)({
            name: "info-file",
            filename: "logs/DCS_Console/dcs-console-info.log",
            level: "info",
            timestamp: timeFormatFn
        }),
        new (winston.transports.DailyRotateFile)({
            name: "error-file",
            filename: "logs/DCS_Console/dcs-console-error.log",
            level: "error",
            timestamp: timeFormatFn
        })
    ]
});

const DCS_Socket = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({timestamp: timeFormatFn}),
        new (winston.transports.DailyRotateFile)({
            name: "info-file",
            filename: "logs/DCS_Socket/dcs-socket-info.log",
            level: "info",
            timestamp: timeFormatFn
        }),
        new (winston.transports.DailyRotateFile)({
            name: "error-file",
            filename: "logs/DCS_Socket/dcs-socket-error.log",
            level: "error",
            timestamp: timeFormatFn
        })
    ]
});

const DCS_Positions = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({timestamp: timeFormatFn}),
        new (winston.transports.DailyRotateFile)({
            name: "info-file",
            filename: "logs/DCS_Positions/dcs-positions-info.log",
            level: "info",
            timestamp: timeFormatFn
        }),
        new (winston.transports.DailyRotateFile)({
            name: "error-file",
            filename: "logs/DCS_Positions/dcs-positions-error.log",
            level: "error",
            timestamp: timeFormatFn
        })
    ]
});

const DCS_Salarie= new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({timestamp: timeFormatFn}),
        new (winston.transports.DailyRotateFile)({
            name: "info-file",
            filename: "logs/DCS_Salarie/dcs-salarie-info.log",
            level: "info",
            timestamp: timeFormatFn
        }),
        new (winston.transports.DailyRotateFile)({
            name: "error-file",
            filename: "logs/DCS_Salarie/dcs-salarie-error.log",
            level: "error",
            timestamp: timeFormatFn
        })
    ]
});

const DCS_Event= new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({timestamp: timeFormatFn}),
        new (winston.transports.DailyRotateFile)({
            name: "info-file",
            filename: "logs/DCS_Event/dcs-event-info.log",
            level: "info",
            timestamp: timeFormatFn
        }),
        new (winston.transports.DailyRotateFile)({
            name: "error-file",
            filename: "logs/DCS_Event/dcs-event-error.log",
            level: "error",
            timestamp: timeFormatFn
        })
    ]
});

const DCS_Image= new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({timestamp: timeFormatFn}),
        new (winston.transports.DailyRotateFile)({
            name: "info-file",
            filename: "logs/DCS_Image/dcs-image-info.log",
            level: "info",
            timestamp: timeFormatFn
        }),
        new (winston.transports.DailyRotateFile)({
            name: "error-file",
            filename: "logs/DCS_Image/dcs-image-error.log",
            level: "error",
            timestamp: timeFormatFn
        })
    ]
});

module.exports = {
    DCS_Console : DCS_Console,
    DCS_Socket : DCS_Socket,
    DCS_Positions : DCS_Positions,
    DCS_Salarie : DCS_Salarie,
    DCS_Event : DCS_Event,
    DCS_Image : DCS_Image
};
