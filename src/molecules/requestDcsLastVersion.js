module.exports = (router, console) =>{
    router.get("/lastdcsversion", (req, res) => {
        res.send("29");
    });
};
