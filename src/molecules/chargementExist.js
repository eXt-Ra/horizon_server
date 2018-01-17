const Chargement = require("./../_MongoDB/models/chargement");
const {
    Position
} = require("./../_MongoDB/models/position");
const async = require("async");

//chargement exist
module.exports = (router) => {
    router.get("/chargement/:token", (req, res) => {
        const token = req.params.token;
        Chargement.findOne({
            token: token
        }).then((charg) => {
            if (charg != null) {
                var positions = [];
                async.forEachOf(charg.positions, function (pos, key, callback) {
                    Position.findOne({
                        numPosition: pos
                    }).then(item => {
                        if (item != null){
                            positions.push(item);
                            callback();
                        }else{
                            callback();
                        }
                    });
                }, () => {
                    const orderPositions = positions.sort((a, b) => {
                        return a.ordrePosition - b.ordrePosition;
                    });
                    res.json(orderPositions);
                });
            } else {
                res.send("NotExist");
            }
        }).catch(err => {
            if (err) throw err;
        });
    });
};
