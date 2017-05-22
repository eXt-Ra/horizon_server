const Chargement = require("./../_MongoDB/models/chargement");
const {Position} = require("./../_MongoDB/models/position");
const async = require("async");
//chargement exist
module.exports = (router) =>{
    router.get("/chargement/:token", (req, res) => {
        const token = req.params.token;
        Chargement.findOne({
            token: token
        }).then((charg) => {
            if (charg != null) {
                const positions = [];
                async.forEachOf(charg.positions, function (pos, key, callback) {
                    Position.findOne({
                        numPosition: pos
                    }).then(item => {
                        positions.push(item);
                        callback();
                    });
                },() => {
                    res.json(positions);
                });
            } else {
                res.send("NotExist");
            }
        }).catch(err => {
            if (err) throw err;
        });
    });
};
