const moment = require("moment");
const postEventAnd = require("./postEventAnd");
const async = require("async");

module.exports = function (router, storage) {
    router.get("/resendEventDay", (req, res) => {
        return new Promise((resolve, reject) => {
            try {
                // console.time("dbsave");
                storage.values().forEach(pos => {
                    const par = [];
                    pos.evenement.forEach(event => {
                        par.push(function(callback) {
                            if(event.source === "DCS" && event.code !== "INVQUAI"){
                                if(moment(event.date).isSame('2017-12-28','day')){
                                    console.log(pos.idPosition);
                                    console.log(event.code);
                                    console.log(event.date);
                                    postEventAnd(event.code, "", "", "", pos.idPosition,storage).then((data) => {
                                        console.info(`Event post successfully ${data}`, {
                                            user: event.user,
                                            idPosition: pos.idPosition,
                                            codeEvent: event.code
                                        });
                                        callback();
                                    }).catch((err) => {
                                        console.error(err);
                                        callback();
                                    });
                                }else{
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        });
                    });
                    console.log(par);
                    async.parallelLimit(par,1, (err, results) => {
                        console.log("ok");
                        resolve(undefined);
                    })
                });

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
