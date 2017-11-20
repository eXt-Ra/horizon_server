const moment = require("moment");
const postEventAnd = require("./postEventAnd");


module.exports = function (router, storage) {
    router.get("/resendEventDay", (req, res) => {
        return new Promise((resolve, reject) => {
            try {
                // console.time("dbsave");
                storage.values().forEach(pos => {
                    pos.evenement.forEach(event => {
                        if(event.source === "DCS" && event.code !== "INVQUAI"){
                            if(moment(event.date).isSame('2017-11-20','day')){
                                console.log(pos.idPosition);
                                console.log(event.code);
                                console.log(event.date);
                                postEventAnd(event.code, "", "", "", pos.idPosition);
                            }
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

        }).then( () => {
            res.send("Ok");
        });
    });
};
