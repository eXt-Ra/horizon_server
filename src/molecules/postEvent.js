
module.exports = (router, console) =>{
//POST EVENT
    router.post("/event", function(req, res) {
        console.log(req.query.codeEvent);
        console.log(req.query.remarque);
        console.log(req.query.imgList);
        res.send("ok");
    });
};
