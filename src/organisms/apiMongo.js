const Chargement = require("./../_MongoDB/models/chargement");

module.exports = (router) => {

    //GET STORECHARG
    router.get("/storeCharg", (req, res) => {
        // get all the users
        Chargement.find({}, function(err, chargs) {
            if (err) throw err;
            res.json(chargs);
        });
    });
};
