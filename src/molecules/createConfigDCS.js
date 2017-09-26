const Config = require("./../_MongoDB/models/configDCS");
//Create Chargement
module.exports = (router, console) => {
    router.post("/config/create", (req, res) => {
        const name = req.query.name;
        const societe = req.query.societe;
        const chargementMode = req.query.typechargement;
        const dechargementMode = req.query.typedechargement;
        const inventaireMode = req.query.typeinventaire;
        const logoutTime = req.query.logoutTime;

        let def = false;

        if (req.query.default == "true") {
            def = true;
        }else {
            def = false;
        }

        let zoneAlert = false;

        if (req.query.wrongZoneAlert == "true") {
            zoneAlert = true;
        }else {
            zoneAlert = false;
        }

        let scanManuel = false;

        if (req.query.scanManuel == "true") {
            scanManuel = true;
        }else {
            scanManuel = false;
        }

        const newConfig = new Config({
            name: name,
            societe: societe,
            isDefault: def,
            chargementMode: chargementMode,
            dechargementMode: dechargementMode,
            inventaireMode: inventaireMode,
            logoutTime:logoutTime,
            wrongZoneAlert: zoneAlert,
            scanManuel : scanManuel
        });

        newConfig.save(function(err) {
            if (err){
                res.status(500).send(err);
                console.error(err);
            }else {
                console.info(`Config Creation Done token = ${name}-${societe}`);
                res.send("Config Creation Done");
            }
        });

    });

    router.post("/config/update", (req, res) => {
        const name = req.query.name;
        const societe = req.query.societe;
        const chargementMode = req.query.typechargement;
        const dechargementMode = req.query.typedechargement;
        const inventaireMode = req.query.typeinventaire;
        const logoutTime = req.query.logoutTime;

        let def = false;

        if (req.query.default == "true") {
            def = true;
        }else {
            def = false;
        }

        let zoneAlert = false;

        if (req.query.wrongZoneAlert == "true") {
            zoneAlert = true;
        }else {
            zoneAlert = false;
        }

        let scanManuel = false;

        if (req.query.scanManuel == "true") {
            scanManuel = true;
        }else {
            scanManuel = false;
        }

        Config.update(
            {
                name: name
            },
            {
                $set: {
                    "societe": societe,
                    "isDefault": def,
                    "chargementMode": chargementMode,
                    "dechargementMode": dechargementMode,
                    "inventaireMode": inventaireMode,
                    "logoutTime":logoutTime,
                    "wrongZoneAlert": zoneAlert,
                    "scanManuel" : scanManuel
                }
            }, (err) => {
                if (err){
                    res.status(500).send(err);
                    console.error(err);
                }else {
                    console.info(`Config Update Done token = ${name}-${societe}`);
                    res.send("Config Update Done");
                }
            });

    });
};
