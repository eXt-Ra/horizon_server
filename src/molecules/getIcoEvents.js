module.exports = (router, console) =>{
//GET ico EVENTS
    router.get("/icoevent/:code", (req, res) => {
        console.log(`Icoevents demande ${req.params.code}`);
        res.sendFile(`/usr/project/server_dcs/icoevents/${req.params.code}_50.png`);
    });
};
