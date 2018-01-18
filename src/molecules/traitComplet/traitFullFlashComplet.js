"use strict";
const moment = require("moment");
const postEventAnd = require("../postEventAnd");
const logger = require("../../organisms/logger");

module.exports = function (numPosition, action, storage, user) {
    return new Promise((resolve, reject) => {
        try {
            storage.values().forEach(pos => {
                if (pos.numPosition === numPosition) {
                    //is all colis flashe today in this action ?
                    let i = 0, g = 0;
                    let isNotSameDay = false;
                    pos.codebarre.forEach(colis => {
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
                                if (!moment(colis.dateDechargement).isSame('1900-01-01', 'day')) {
                                    g++;
                                    if (!moment(colis.dateDechargement).isSame(moment().format(), "day")) {
                                        isNotSameDay = true;
                                    }
                                }
                                break;
                            case "inventaire":
                                if (moment(colis.dateInventaire).isSame(moment().format(), "day")) {
                                    i++;
                                }
                                break;
                        }
                    });

                    if (g == pos.codebarre.length) {
                        const sch = pos.evenement.find((o) => {
                            return (o.code.indexOf("COMPLET") > -1);
                        });
                        if (sch == undefined && isNotSameDay) {
                            logger.DCS_Console.info(">> NOT PROD COMPLET OTHER DAY <<");
                            pos.evenement.push({
                                "information": "",
                                "remarque": "",
                                "date": moment().format(),
                                "libelle": "",
                                "code": "COMPLET",
                                "source": "DCS",
                                "eventuser": user
                            });
                            postEventAnd("COMPLET", "", "", user, pos.idPosition, storage);
                        }
                    }
                    debugger;

                    if (i == pos.codebarre.length) {
                        switch (action) {
                            case "chargement":
                                //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                if (pos.ChargementEventDoneAt == undefined || !(moment(pos.ChargementEventDoneAt).isSame(moment().format(), "day"))) {
                                    const sch = pos.evenement.find((o) => {
                                        return o.source == "DCS" && (o.code.indexOf("EXP") > -1);
                                    });
                                    if (sch == undefined) {
                                        setTimeout(() => {
                                            storage.values().forEach(pos => {
                                                if (pos.numPosition === numPosition) {
                                                    const sch = pos.evenement.find((o) => {
                                                        return o.source == "DCS" && (o.code.indexOf("EXP") > -1);
                                                    });

                                                    if (sch == undefined) {
                                                        position.evenement.push({
                                                            "information": "",
                                                            "remarque": "",
                                                            "date": moment().format(),
                                                            "libelle": "",
                                                            "code": "EXPCFM",
                                                            "source": "DCS",
                                                            "eventuser": user
                                                        });
                                                        postEventAnd("EXPCFM", "", "", user, pos.idPosition, storage);
                                                    }
                                                }
                                            });
                                        }, 120000);
                                    }
                                    logger.DCS_Positions.info(`Event full COMPLET ${action} for ${numPosition}`);
                                } else {
                                    logger.DCS_Positions.info(`Event full COMPLET ${action} already done today for ${numPosition}`);
                                }
                                break;
                            case "dechargement":
                                debugger;
                                //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                if (pos.DechargementEventDoneAt == undefined || !(moment(pos.DechargementEventDoneAt).isSame(moment().format(), "day"))) {
                                    pos.DechargementEventDoneAt = moment().format();
                                    //si il a eu un autre event ne rien faire
                                    debugger;
                                    const sch = pos.evenement.find((o) => {
                                        return o.source == "DCS" && (o.code.indexOf("AAR") > -1);
                                    });

                                    if (sch == undefined) {
                                        //timeout si la mise du arrcfm en cas d'avarie sur le dernier colis
                                        setTimeout(() => {
                                            storage.values().forEach(pos => {
                                                if (pos.numPosition === numPosition) {
                                                    const sch = pos.evenement.find((o) => {
                                                        return o.source == "DCS" && (o.code.indexOf("AAR") > -1);
                                                    });
                                                    if (sch == undefined) {
                                                        pos.evenement.push({
                                                            "information": "",
                                                            "remarque": "",
                                                            "date": moment().format(),
                                                            "libelle": "",
                                                            "code": "AARCFM",
                                                            "source": "DCS",
                                                            "eventuser": user
                                                        });
                                                        logger.DCS_Positions.info("hey");
                                                        storage.setItem(numPosition, pos);
                                                        postEventAnd("AARCFM", "", "", user, pos.idPosition, storage);
                                                    }
                                                }
                                            });
                                        }, 120000);
                                    }
                                    logger.DCS_Positions.info(`Event full COMPLET ${action} for ${numPosition}`);
                                } else {
                                    logger.DCS_Positions.info(`Event full COMPLET ${action} already done today for ${numPosition}`);
                                }
                                break;
                            case "inventaire":
                                //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                if (pos.InventaireEventDoneAt == undefined || !(moment(pos.InventaireEventDoneAt).isSame(moment().format(), "day"))) {
                                    pos.InventaireEventDoneAt = moment().format();
                                    const sch = pos.evenement.find((o) => {
                                        return o.code == "AARCFM";
                                    });
                                    if (sch == undefined) {
                                        //timeout si la mise du arrcfm en cas d'avarie sur le dernier colis
                                        setTimeout(() => {
                                            storage.values().forEach(pos => {
                                                if (pos.numPosition === numPosition) {
                                                    const sch = pos.evenement.find((o) => {
                                                        return o.source == "DCS" && (o.code.indexOf("AAR") > -1);
                                                    });
                                                    if (sch == undefined) {
                                                        pos.evenement.push({
                                                            "information": "",
                                                            "remarque": "",
                                                            "date": moment().format(),
                                                            "libelle": "",
                                                            "code": "AARCFM",
                                                            "source": "DCS",
                                                            "eventuser": user
                                                        });
                                                        logger.DCS_Positions.info("hey");
                                                        storage.setItem(numPosition, pos);
                                                        postEventAnd("AARCFM", "", "", user, pos.idPosition, storage);
                                                    }
                                                }
                                            });
                                        }, 120000);
                                    }
                                    logger.DCS_Positions.info(`Event full COMPLET ${action} for ${numPosition}`);
                                } else {
                                    logger.DCS_Positions.info(`Event full COMPLET ${action} already done today for ${numPosition}`);
                                }
                                break;
                        }
                        storage.setItem(pos.numPosition, pos);
                    }
                    resolve();
                }
            });
        } catch (e) {
            reject(e);
        }

    });
};
