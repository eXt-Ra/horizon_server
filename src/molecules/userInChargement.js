const Chargement = require("./../_MongoDB/models/chargement");

//chargement exist
module.exports = (router) =>{
    router.get("/userInChargement/:token", (req, res) => {
        const token = req.params.token;
        Chargement.findOne({
            token: token
        }).then((charg) => {
            if (charg != null) {
                res.json(charg.users);
            } else {
                res.send("NotExist");
            }
        }).catch(err => {
            if (err) throw err;
        });
    });
};
