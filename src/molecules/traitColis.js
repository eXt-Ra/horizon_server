// const storage = require("node-persist");
const updateColisStorage = require("./updateColisStorage");
const updateColisProd = require("./updateColisProd");
const traitFullFlash = require("./traitFullFlash");
const logger = require("./../organisms/logger");

module.exports = function(num, action, user, zone, storage, societe) {
    return new Promise((resolve, reject) => {
        logger.DCS_Positions.info(zone);
        updateColisStorage(num, action, user, zone, storage)
            .then(pos => {
                return storage.setItem(pos.numPosition, pos);
            }).then(() => {
                logger.DCS_Positions.info(`UPDATE_STORAGE | Update ${action} from ${num}`);
                //update DB
                return updateColisProd(num, action, user, zone, societe);
            }).then( () => {
                if (zone != undefined) {
                    logger.DCS_Positions.info(`UPDATE_DB | Update ${action} from ${num} at ${zone}`);
                } else {
                    logger.DCS_Positions.info(`UPDATE_DB | Update ${action} from ${num}`);
                }
                //check if fullFlash de l'action
                return traitFullFlash(num, action, storage, user);
            }).then(() => {
                resolve();
            }).catch( err => {
                debugger;
                reject(err);
            });
    });
};
