const storage = require("node-persist");
const moment = require("moment");

module.exports = function(num, action, user, zone) {
    return new Promise((resolve,reject) => {
        try {
            storage.values().forEach( pos => {
                pos.codebarre.forEach(cb => {
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
