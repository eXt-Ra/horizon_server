module.exports = function(num, storage, societe) {
    return new Promise( (resolve,reject) => {
        try {
            // console.time("dbsave");
            storage.values().forEach( pos => {
                pos.codebarre.forEach(cb => {
                    if (cb.numero === num && pos.societe === societe) {
                        // console.timeEnd("dbsave");
                        resolve(pos);
                    }
                });
            });

            resolve(undefined);

            // console.log(societe);
            // const p = storage.values().find( pos => {
            //     return pos.codebarre.find(cb => {
            //         return cb.numero === num && pos.societe === societe;
            //     });
            // });
            // console.timeEnd("dbsave");
            // resolve(p);
        } catch (e) {
            reject(e);
        }

    });
};
