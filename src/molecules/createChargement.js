const Chargement = require("./../_MongoDB/models/chargement");
const moment = require("moment");
//Create Chargement
module.exports = (router, console) => {
    router.post("/chargement/create", (req, res) => {
        const zone = req.query.zone;
        const user = req.query.user;
        const societe = req.query.societe;

        const newCharg = new Chargement({
            token: `${zone}-${societe}`,
            status: "progress",
            dateCrea: moment().format(),
            userCrea: user,
            users: [{
                user: user
            }],
            logs: [],
            societe: societe,
            zone: zone,
            positions: []
        });
        newCharg.save(function(err) {
            if (err) throw err;
            console.info(`Chargement Creation Done token = ${zone}-${societe}`);
            res.send("Chargement Creation Done");
        });
    });
};
