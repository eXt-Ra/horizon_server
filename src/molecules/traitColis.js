// const storage = require("node-persist");
const updateColisStorage = require("./updateColisStorage");
const updateColisProd = require("./updateColisProd");
const traitFullFlash = require("./traitFullFlash");

const console = process.console;

module.exports = function(num, action, user, zone, storage) {
    return new Promise((resolve, reject) => {
        updateColisStorage(num, action, user, zone, storage)
            .then(pos => {
                return storage.setItem(pos.numPosition, pos);
            }).then(() => {
                console.tag({
                    msg: `UPDATE_STORAGE | ${action}`,
                    colors: ["italic", "magenta", "bgBlue", "bold"]
                }).time().file().info(`Update ${action} from ${num}`);
                //update DB
                return updateColisProd(num, action, user, zone);
            }).then(() => {
                if (zone != undefined) {
                    console.tag({
                        msg: `UPDATE_DB | ${action}`,
                        colors: ["italic", "magenta", "bgWhite", "bold"]
                    }).time().file().info(`Update ${action} from ${num} at ${zone}`);
                } else {
                    console.tag({
                        msg: `UPDATE_DB | ${action}`,
                        colors: ["italic", "magenta", "bgWhite", "bold"]
                    }).time().file().info(`Update ${action} from ${num}`);
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
