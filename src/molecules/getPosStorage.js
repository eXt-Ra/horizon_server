const storage = require("node-persist");
module.exports = function(num) {
    return new Promise( (resolve,reject) => {
        try {
            storage.values().forEach( pos => {
                pos.codebarre.forEach(cb => {
                    if (cb.numero === num) {
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
