const Chargement = require("./../_MongoDB/models/chargement");
const {Position} = require("./../_MongoDB/models/position");
const moment = require("moment");

module.exports = (io,router, console, storage) => {
  //POST IMAGE
    router.post("/position", function(req, res) {
        Chargement.findOne({
            token: req.query.token
        }).then(charg => {
            if (charg != null) {
                storage.getItem(req.query.numPosition).then(pos => {
                    pos.ordrePosition = Number(req.query.index);
                    const newPos = new Position(pos);
                    newPos.save((err) => {
                        if (err){
                            // TODO: error position déja ajouter
                            console.info(`API addPos Position en double ${req.query.numPosition} / ${req.query.user}`);
                        }
                    });

                    if (charg.positions.length == 0) {
                        charg.positions.push(newPos.numPosition);
                    }else {
                        charg.positions.unshift(newPos.numPosition);
                    }

                    charg.logs.push({
                        type: "addPos",
                        user: req.query.user,
                        date: moment().format(),
                        info: newPos.numPosition
                    });
                    charg.save(function(err) {
                        if (err) throw err;
                        console.info(`API addPos UPDATE ${req.query.token} / ${req.query.numPosition} / ${req.query.user}`);
                    });
                    io.broadcast.to(req.query.token).emit("CHA.addPos_Notif", req.query.numPosition);
                });
            }
        }).catch(err => {
            res.status(200).send(err);
        });
    });
};
