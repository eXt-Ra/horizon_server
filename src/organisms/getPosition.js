const getPosProdTable = require("./../molecules/getPosProdTable");
const getPosOnlyColisProdTable = require("./../molecules/getPosOnlyColisProdTable");
const getPosTempTable = require("./../molecules/getPosTempTable");
const getPosOnlyColisTempTable = require("./../molecules/getPosOnlyColisTempTable");
const getPosStorage = require("./../molecules/getPosStorage");
const getColisProdTable = require("./../molecules/getColisProdTable");
const getColisTempTable = require("./../molecules/getColisTempTable");
const getEventProd = require("./../molecules/getEventProd");
const traitColis = require("./../molecules/traitColis");

//GET ACTION
module.exports = (router, console, storage) =>{
    router.get("/:action/:user/:numColis", (req, res) => {

        let numColis = "";
        if (req.query.numColis === undefined) {
            numColis = req.params.numColis;
        }else {
            numColis = req.query.numColis;
        }
        
        //is in storage
        let newStorage = {};
        getPosStorage(numColis, storage)
            .then(resStore => {
                if (resStore != undefined) {
                    console.tag({
                        msg: `STORAGE | ${req.params.action}`,
                        colors: ["italic", "grey", "bold"]
                    }).time().file().info({
                        num: resStore.numPosition,
                        user: req.params.user
                    });
                    if (req.params.action != "infocolis") {
                        traitColis(numColis, req.params.action, req.params.user, req.query.zone,storage);
                    }
                    res.json(resStore);
                } else {
                    // is position in tempTable
                    if (req.params.action == "chargement") {
                        return getPosOnlyColisTempTable(numColis, req.query.societe);
                    }else {
                        return getPosTempTable(numColis, req.query.societe);
                    }
                }
            })
            .then(resPos => {
                if (resPos != undefined) {
                    if (resPos.length == 0) {
                        console.tag({
                            msg: `TEMP_DB | ${req.params.action}`,
                            colors: ["italic", "magenta", "bold"]
                        }).time().file().info(`no result ${numColis} par ${req.params.user}`);
                    // is position in prodTable
                        if (req.params.action == "chargement") {
                            return getPosOnlyColisProdTable(numColis, req.query.societe);
                        }else {
                            return getPosProdTable(numColis, req.query.societe);
                        }
                    } else {
                        newStorage = resPos[0];
                    //load colis sql temp
                        return getColisTempTable(resPos[0].idPosition, req.query.societe)
                        .then(resColis => {
                            newStorage.codebarre = resColis;
                            newStorage.societe = req.query.societe;
                            return getEventProd(resPos[0].idPosition);
                        }).then(resEvent => {
                            newStorage.evenement = resEvent;
                            //storage de la position
                            storage.setItem(newStorage.numPosition, newStorage)
                                .then(() => {
                                    if (req.params.action != "infocolis") {
                                        traitColis(numColis, req.params.action, req.params.user, req.query.zone,storage);
                                    }
                                });
                            console.tag({
                                msg: `TEMP_DB | ${req.params.action}`,
                                colors: ["italic", "magenta", "bold"]
                            }).time().file().info({
                                num: numColis,
                                user: req.params.user
                            });
                            res.status(200).json(newStorage);
                        }).catch(err => {
                            res.status(500).json(err);
                        });
                    }
                }
            }).then(resPos => {
                if (resPos != undefined) {
                    if (resPos.length == 0) {
                        console.tag({
                            msg: `PROD_DB | ${req.params.action}`,
                            colors: ["italic", "blue", "bold"]
                        }).time().file().info(`no result ${numColis} par ${req.params.user}`);
                        res.status(200).json(resPos);
                        throw "finish";
                    } else {
                        newStorage = resPos[0];
                    //load colis sql prod
                        getColisProdTable(resPos[0].idPosition)
                        .then(resColis => {
                            newStorage.codebarre = resColis;
                            newStorage.societe = req.query.societe;
                            return getEventProd(resPos[0].idPosition);
                        }).then(resEvent => {
                            newStorage.evenement = resEvent;
                            //storage de la position
                            storage.setItem(newStorage.numPosition, newStorage)
                                .then(() => {
                                    if (req.params.action != "infocolis") {
                                        traitColis(numColis, req.params.action, req.params.user, req.query.zone, storage);
                                    }
                                });
                            console.tag({
                                msg: `PROD_DB | ${req.params.action}`,
                                colors: ["italic", "blue", "bold"]
                            }).time().file().info({
                                num: numColis,
                                user: req.params.user
                            });
                            res.status(200).json(newStorage);
                        });
                    }
                }
            }).catch( err =>{
                console.tag({
                    msg: `ERR | ${numColis}`,
                    colors: ["italic", "red", "bold"]
                }).time().file().info(err);
            });
    });
};
