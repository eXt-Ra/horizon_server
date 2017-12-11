const UserDcs = require("./../_MongoDB/models/userdcs");

module.exports = (router, console, storePos) => {
  //GET STOREPOS
    router.get("/storePos", (req, res) => {
        res.json(storePos.values());
    });

  // //GET STORECHARG
  // router.get("/storeCharg", (req, res) => {
  //     res.json(storeCharg.values());
  // });

  //clear STOREPOS
    router.get("/storePos/clear", (req, res) => {
        storePos.clear()
      .then(err => {
          if (err) {
              res.send(err);
          }
          console.info("STORAGE CLEAR");
          res.send("ok");
      });
    });

  //REMOVE STOREPOS
    router.get("/storePos/remove/storage/:numPosition", (req, res) => {
        storePos.removeItem(req.params.numPosition)
      .then(err => {
          if (err) {
              res.send(err);
          }
          console.info(`STORAGE Remove ${req.params.numPosition}`);
          res.send("ok");
      });
    });

  //REMOVE STOREPOS
    router.get("/salarie/isConnected", (req, res) => {
        UserDcs.find({
            connected : true
        }, (err, users) => {
            if (err) throw err;
            if (users != null) {
                res.json(users);
            }else {
                res.sendStatus(404);
            }
        });
    });
};
