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
                console.tag("STOREPOS").time().file().info("CLEAR");
                res.send("ok");
            });
    });

    //REMOVE STOREPOS
    router.get("/storePos/remove/:numPosition", (req, res) => {
        storePos.removeItem(req.params.numPosition)
            .then(err => {
                if (err) {
                    res.send(err);
                }
                console.tag("STOREPOS").time().file().info(`Remove ${req.params.numPosition}`);
                res.send("ok");
            });
    });
};
