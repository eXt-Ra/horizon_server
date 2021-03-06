const UserDcs = require("./../_MongoDB/models/userdcs");

//GET SALARIE
module.exports = (router, console, io) =>{
    router.get("/salarielogout", (req, res) => {
        UserDcs.findOne({
            code: req.query.user
        }, (err, user) => {
            if (err) throw err;
            if (user != null) {
                user.connected = false;
                console.info(`USER : ${user.code} DISCONN`);
                io.to("desktop").emit("suppSmart", user.code);
                user.save((err) => {
                    if (err) throw err;
                    res.status(200).json([
                        {
                            "SALCODE": "RVANARDO",
                            "SALSOCCODE": "DEA25"
                        }
                    ]);
                });
            }
        });
    });
};
