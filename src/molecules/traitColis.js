// const storage = require("node-persist");
const updateColisStorage = require("./updateColisStorage");
const updateColisProd = require("./updateColisProd");
const traitFullFlash = require("./traitFullFlash");
const logger = require("./../organisms/logger");

module.exports = function(num, action, user, zone, storage) {
    return new Promise((resolve, reject) => {
        updateColisStorage(num, action, user, zone, storage)
            .then(pos => {
                return storage.setItem(pos.numPosition, pos);
            }).then(() => {
                logger.DCS_Positions.info(`UPDATE_DB | Update ${action} from ${num}`);
                //update DB
                return updateColisProd(num, action, user, zone);
            }).then(() => {
                if (zone != undefined) {
                    logger.DCS_Positions.info(`UPDATE_DB | Update ${action} from ${num} at ${zone}`);
                } else {
                    logger.DCS_Positions.info(`UPDATE_DB | Update ${action} from ${num}`);
                }
                //check if fullFlash de l'action
                return traitFullFlash(num, action, storage);
            }).then(() => {
                resolve();
            }).catch( err => {
                reject(err);
            });
    });
};
