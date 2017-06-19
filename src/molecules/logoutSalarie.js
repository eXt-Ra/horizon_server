const UserDcs = require("./../_MongoDB/models/userdcs");

//GET SALARIE
module.exports = (router, console, io) =>{
    router.get("/salarielogout", (req, res) => {
        console.log("sssss");
        UserDcs.findOne({
            code: req.query.user
        }, (err, user) => {
            if (err) throw err;
            if (user != null) {
                user.connected = false;
                console.tag("SALARIELOGOUT").time().file().info(`USER : ${user.code} DISCONN`);
                io.to("desktop").emit("suppSmart", user.code);
                user.save((err) => {
                    if (err) throw err;
                    res.status(200).json(user);
                });
            }
        });
    });
};
