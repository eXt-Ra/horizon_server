module.exports = (router) =>{
//GET ico EVENTS
    router.get("/icoevent/:code", (req, res) => {
        res.sendFile(`/usr/project/Horizon/icoevents/${req.params.code}_50.png`);
        // res.sendFile(`${__dirname}/icoevents/${req.params.code}_50.png`);
        // res.sendFile(`${req.params.code}_50.png`, { root: "/Users/eXtRa/Documents/Dev/Horizon/icoevents"});
    });
};
