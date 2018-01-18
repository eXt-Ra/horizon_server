const moment = require("moment");
const _ = require("lodash");
const postEventAnd = require("./postEventAnd");

module.exports = function (numPosition, action, user, zone, storage) {
    return new Promise((resolve, reject) => {
        try {
            storage.values().forEach(pos => {
                if (pos.numPosition === numPosition) {
                    pos.codebarre.forEach(cb => {
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
                                var schColis = _.find(pos.codebarre, (o) => {
                                    return moment(o.dateInventaire).isSame(moment().format(), "day") && o.zoneDeQuai == zone;
                                });
                                if (schColis == undefined) {
                                    postEventAnd("INVQUAI", "INVQUAI", zone, user, pos.idPosition);
                                    pos.evenement.push({
                                        "information": "",
                                        "remarque": zone,
                                        "date": moment().format(),
                                        "libelle": "INVQUAI",
                                        "code": "INVQUAI",
                                        "source": "DCS",
                                        "eventuser": user
                                    });
                                }
                                cb.dateInventaire = moment().format();
                                cb.quiInventaire = user;
                                cb.zoneDeQuai = zone;
                                break;
                        }
                    });
                    debugger;
                    resolve(pos);
                }
            });
            resolve(undefined);
        } catch (e) {
            reject(e);
        }
    });
};
