const ConfigDCS = require("./../_MongoDB/models/configDCS");

module.exports = (router, console) => {
    router.get("/copyConfigToConfigDcs", (req, res) => {
        console.info("Start COPY")
        ConfigDCS.find({}, (err, configs) => {
            if (err) throw err;
            configs.forEach(conf => {
                const newConfDcs = new ConfigDCS({
                    name: conf.name,
                    societe: conf.societe,
                    isDefault: conf.isDefault,
                    chargementMode: conf.chargementMode,
                    dechargementMode: conf.dechargementMode,
                    inventaireMode: conf.inventaireMode,
                    logoutTime: conf.logoutTime,
                    wrongZoneAlert: conf.wrongZoneAlert,
                    scanManuel: conf.scanManuel,
                    scanZoneDechargement: conf.scanZoneDechargement
                });
                newConfDcs.save((err) => {
                    if (err) throw err;
                    console.info(`Copy de ${conf.name}`);
                });
            });
            res.send(`Copy done for ${configs.length} objects`);
        });
    });
}
