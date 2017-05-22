const postEventAnd = require("./postEventAnd");
const moment = require("moment");
const traitColis = require(".//traitColis");

module.exports = (router, console, storage) => {
  //POST EVENT
    router.post("/event", function(req, res) {
        postEventAnd(req.query.codeEvent,req.query.libEvent, req.query.remarque, req.query.user, req.query.idPosition)
        .then((data) =>{
            console.log(`Event post successfully ${data}`);
            res.status(200).send("Event post successfully");
        }).catch((err)=>{
            console.error(err);
            res.status(500).send(err);
        });
        const sch = storage.values().find((o) => {
            return o.idPosition == req.query.idPosition;
        });

        if (sch != undefined) {
            sch.evenement.push({
                "information":"",
                "remarque":req.query.remarque,
                "date":moment().format(),
                "libelle":req.query.libEvent,
                "code":req.query.codeEvent,
                "source":"DCS"
            });

            storage.setItem(sch.numPosition, sch);

            if (req.query.codeEvent == "COMPLET") {
                if (req.query.zone != undefined) {
                    sch.codebarre.forEach(colis =>{
                        traitColis(colis.numero, "inventaire", req.query.user, req.query.zone,storage);
                    });
                }else {
                    sch.codebarre.forEach(colis =>{
                        traitColis(colis.numero, "dechargement", req.query.user, "",storage);
                    });
                }
            }
        }
    });
};
