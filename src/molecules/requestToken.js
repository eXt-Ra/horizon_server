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
                console.log(newUser);
                newUser.save(function(err) {
                    if (err) throw err;
                    console.log("User saved successfully");
                    res.send(newUser.token);
                });
            }else {
                userapi.societe = req.query.societe;
                userapi.save(function(err) {
                    if (err) throw err;
                    console.log("User saved successfully");
                    res.send(userapi.token);
                });
            }
        });

    });
};
