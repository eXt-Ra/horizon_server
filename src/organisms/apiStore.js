
module.exports = (router, console, storage) =>{
//GET STORE
    router.get("/store", (req, res) => {
        res.json(storage.values());
    });

//clear STORE
    router.get("/store/clear", (req, res) => {
        storage.clear()
    .then(err =>{
        if (err) {
            res.send(err);
        }
        console.tag("STORE").time().file().info("CLEAR");
        res.send("ok");
    });
    });

//REMOVE STORE
    router.get("/store/remove/:numPosition", (req, res) => {
        storage.removeItem(req.params.numPosition)
    .then(err =>{
        if (err) {
            res.send(err);
        }
        console.tag("STORE").time().file().info(`Remove ${req.params.numPosition}`);
        res.send("ok");
    });
    });
};
