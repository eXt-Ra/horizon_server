"use strict";
const storage = require("node-persist");
const moment = require("moment");
const console = process.console;

module.exports = function(num, action) {
    return new Promise((resolve,reject) => {
        try {
            storage.values().forEach(pos => {
                pos.codebarre.forEach(cb => {
                    if (cb.numero === num) {
                        //is all colis flashe today in this action ?
                        let i = 0;
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
                                if (pos.ChargementEventDoneAt == undefined || !(moment(pos.ChargementEventDoneAt).isSame(moment().format(), "day"))) {
                                    pos.ChargementEventDoneAt = moment().format();
                                    // TODO creation de l'event
                                    console.tag({
                                        msg: `EVENT_FULL | ${action}`,
                                        colors: ["magenta", "bgYellow", "bold"]
                                    }).time().file().info(`Event full ${action} for ${num}`);
                                } else {
                                    console.tag({
                                        msg: `EVENT_FULL | ${action}`,
                                        colors: ["bgRed", "bold"]
                                    }).time().file().info(`Event full ${action} already done today for ${num}`);
                                }
                                break;
                            case "dechargement":
                            //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                if (pos.DechargementEventDoneAt == undefined || !(moment(pos.DechargementEventDoneAt).isSame(moment().format(), "day"))) {
                                    pos.DechargementEventDoneAt = moment().format();
                                // TODO creation de l'event
                                    console.tag({
                                        msg: `EVENT_FULL | ${action}`,
                                        colors: ["magenta", "bgYellow", "bold"]
                                    }).time().file().info(`Event full ${action} for ${num}`);
                                } else {
                                    console.tag({
                                        msg: `EVENT_FULL | ${action}`,
                                        colors: ["bgRed", "bold"]
                                    }).time().file().info(`Event full ${action} already done today for ${num}`);
                                }
                                break;
                            case "inventaire":
                            //si EventDoneAt not à la date du jours ou inexistant > faire l'event
                                if (pos.InventaireEventDoneAt == undefined || !(moment(pos.InventaireEventDoneAt).isSame(moment().format(), "day"))) {
                                    pos.InventaireEventDoneAt = moment().format();
                                // TODO creation de l'event
                                    console.tag({
                                        msg: `EVENT_FULL | ${action}`,
                                        colors: ["magenta", "bgYellow", "bold"]
                                    }).time().file().info(`Event full ${action} for ${num}`);
                                } else {
                                    console.tag({
                                        msg: `EVENT_FULL | ${action}`,
                                        colors: ["bgRed", "bold"]
                                    }).time().file().info(`Event full ${action} already done today for ${num}`);
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
