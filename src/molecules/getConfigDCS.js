const Config = require("./../_MongoDB/models/configDCS");
//chargement exist
module.exports = (router, console) =>{
    router.get("/config", (req, res) => {
        const name = req.query.name;
        const societe = req.query.societe;
        const isDefault = req.query.default;
        if (isDefault == "true") {
            Config.findOne({
                isDefault: true,
                societe: societe
            }).then((config) => {
                if (config != null) {
                    console.info(`Config get Default ${societe}`);
                    res.json(config);
                } else {
                    res.send("NotExist");
                }
            }).catch(err => {
                if (err) throw err;
            });
        }else {
            if (name != undefined) {
                Config.findOne({
                    name: name
                }).then((config) => {
                    if (config != null) {
                        console.info(`Config get Name ${name}`);
                        res.json(config);
                    } else {
                        res.send("NotExist");
                    }
                }).catch(err => {
                    if (err) throw err;
                });
            }else {
                if (societe != undefined) {
                    Config.find({
                        societe: societe
                    }).then((configs) => {
                        if (configs != null) {
                            console.info(`Config get List ${societe}`);
                            const arrayConfig =[];
                            configs.forEach( item =>{
                                arrayConfig.push(item.name);
                            });
                            res.json(arrayConfig);
                        } else {
                            res.send("NotExist");
                        }
                    }).catch(err => {
                        if (err) throw err;
                    });
                }else {
                    Config.find({}).then((configs) => {
                        if (configs != null) {
                            res.json(configs);
                        } else {
                            res.send("NotExist");
                        }
                    }).catch(err => {
                        if (err) throw err;
                    });
                }
            }
        }

    });
};
