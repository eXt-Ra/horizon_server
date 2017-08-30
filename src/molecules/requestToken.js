const UserApi = require("./../_MongoDB/models/userapi");
const uid = require("rand-token").uid;

//Create Chargement
module.exports = (router, console) =>{
    router.get("/token", (req, res) => {
        UserApi.findOne({
            name : req.query.serial
        },(err ,userapi) =>{
            if (userapi == null) {
                var newUser = new UserApi({
                    name: req.query.serial,
                    token: uid(16),
                    societe: req.query.societe,
                    type: req.query.model,
                    active: true
                });
                console.info("requestToken",newUser);
                newUser.save(function(err) {
                    if (err) throw err;
                    console.info("requestToken",`User saved successfully ${newUser.name}`);
                    res.send(newUser.token);
                });
            }else {
                userapi.societe = req.query.societe;
                userapi.save(function(err) {
                    if (err) throw err;
                    console.info("requestToken",`Token successfully requested ${userapi.name}`);
                    res.send(userapi.token);
                });
            }
        });

    });
};
