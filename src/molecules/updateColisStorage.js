const moment = require("moment");
const _ = require("lodash");
const postEventAnd = require("./postEventAnd");

module.exports = function(num, action, user, zone, storage) {
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
                            var schColis = _.find(pos.codebarre, (o) => {
                                return moment(o.dateInventaire).isSame(moment().format(), "day") && o.zoneDeQuai == zone;
                            });
                            if (schColis == undefined) {
                                postEventAnd("INVQUAI","INVQUAI",zone, user, pos.idPosition);
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
