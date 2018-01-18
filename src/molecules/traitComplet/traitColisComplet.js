// const storage = require("node-persist");
const updateColisCompletStorage = require("../updateColisCompletStorage");
const updateColisProd = require("../updateColisProd");
const traitFullFlashComplet = require("./traitFullFlashComplet");
const logger = require("../../organisms/logger");

module.exports = function(numPosition, action, user, zone, storage, societe) {
    return new Promise((resolve, reject) => {
        updateColisCompletStorage(numPosition, action, user, zone, storage)
            .then(pos => {
                debugger;
                logger.DCS_Positions.info(`UPDATE_STORAGE COMPLET | Update ${action} from ${numPosition}`);
                pos.codebarre.forEach( cb => {
                    updateColisProd(cb.numero, action, user, zone, societe)
                });
                return storage.setItem(pos.numPosition, pos);
            }).then( () => {
                debugger;
                if (zone != undefined) {
                    logger.DCS_Positions.info(`UPDATE_DB COMPLET | Update ${action} from ${numPosition} at ${zone}`);
                } else {
                    logger.DCS_Positions.info(`UPDATE_DB COMPLET | Update ${action} from ${numPosition}`);
                }
                //check if fullFlash de l'action
                return traitFullFlashComplet(numPosition, action, storage, user);
            }).then(() => {
                resolve();
            }).catch( err => {
                debugger;
                reject(err);
            });
    });
};
