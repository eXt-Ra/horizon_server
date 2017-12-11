"use strict";
const moment = require("moment");
const postEventAnd = require("./postEventAnd");
const logger = require("./../organisms/logger");

module.exports = function (num, action, storage) {
    return new Promise((resolve, reject) => {
        try {
            storage.values().forEach(pos => {
                pos.codebarre.forEach(cb => {
                    if (cb.numero === num) {
                        //is all colis flashe today in this action ?
                        let i = 0;
                        let g = 0;
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
                                    if (moment(colis.dateDechargement).isSame(moment("1900-01-01").format(), "day")) {
                                        isNotSameDay = true;
                                    }
                                    if (colis.dateDechargement) {
                                        g++;
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
                                postEventAnd("COMPLET", "", "", "", pos.idPosition);
                            }
                        }

                        if (i == pos.codebarre.length) {
                            switch (action) {
                                case "chargement":
                                    //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                    if (pos.ChargementEventDoneAt == undefined || !(moment(pos.ChargementEventDoneAt).isSame(moment().format(), "day"))) {
                                        pos.ChargementEventDoneAt = moment().format();
                                        // TODO creation de l'event
                                        logger.DCS_Positions.info(`Event full ${action} for ${num}`);
                                    } else {
                                        logger.DCS_Positions.info(`Event full ${action} already done today for ${num}`);
                                    }
                                    break;
                                case "dechargement":
                                    //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                    if (pos.DechargementEventDoneAt == undefined || !(moment(pos.DechargementEventDoneAt).isSame(moment().format(), "day"))) {
                                        pos.DechargementEventDoneAt = moment().format();
                                        //si il a eu un autre event ne rien faire
                                        const sch = pos.evenement.find((o) => {
                                            return o.source == "DCS" && (o.code.indexOf("AAR") > -1);
                                        });
                                        if (sch == undefined) {
                                            //timeout si la mise du arrcfm en cas d'avarie sur le dernier colis
                                            setTimeout(() => {
                                                storage.values().forEach(pos => {
                                                    pos.codebarre.forEach(cb => {
                                                        if (cb.numero === num) {
                                                            const sch = pos.evenement.find((o) => {
                                                                return o.source == "DCS" && (o.code.indexOf("AAR") > -1);
                                                            });
                                                            if (sch == undefined) {
                                                                postEventAnd("AARCFM", "", "", "", pos.idPosition);
                                                            }
                                                        }
                                                    });
                                                });
                                            }, 120000);
                                        }

                                        logger.DCS_Positions.info(`Event full ${action} for ${num}`);
                                    } else {
                                        logger.DCS_Positions.info(`Event full ${action} already done today for ${num}`);
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
                                                    pos.codebarre.forEach(cb => {
                                                        if (cb.numero === num) {
                                                            const sch = pos.evenement.find((o) => {
                                                                return o.source == "DCS" && (o.code.indexOf("AAR") > -1);
                                                            });
                                                            if (sch == undefined) {
                                                                postEventAnd("AARCFM", "", "", "", pos.idPosition);
                                                            }
                                                        }
                                                    });
                                                });
                                            }, 120000);
                                        }
                                        logger.DCS_Positions.info(`Event full ${action} for ${num}`);
                                    } else {
                                        logger.DCS_Positions.info(`Event full ${action} already done today for ${num}`);
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
