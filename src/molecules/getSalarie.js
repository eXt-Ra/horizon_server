const sql = require("mssql");
const conn = require("./../conn");
const UserDcs = require("./../_MongoDB/models/userdcs");

//GET SALARIE
module.exports = (router, console) =>{
    router.get("/salarie/:val", (req, res) => {
        new sql.Request(conn).input("val", sql.NVarChar, req.params.val)
            .query("SELECT TOP 1 SALCODE, SALSOCCODE FROM SALARIE WHERE SALCODE=@val OR SALNUMPERMIS=@val", function(err, recordset) {
                if (err) {
                    console.tag("SALARIE").time().file().error(err);
                    res.status(500).send(err);
                }
                if (recordset.length === 0) {
                    console.tag("SALARIE").time().file().info(`${req.params.val} No result`);
                    res.status(204).send("No result");
                }else {
                    UserDcs.findOne({
                        code: recordset[0].SALCODE
                    }, (err, user) => {
                        if (err) throw err;
                        if (user != null) {
                            if (user.connected) {
                                console.tag("SALARIE").time().file().info(`${recordset[0].SALCODE} already connected`);
                                res.status(409).send("User already connected");
                            }else {
                                console.tag("SALARIE").time().file().info(req.params.val);
                                res.status(200).json(recordset);
                                user.lastConn = new Date();
                                user.connected = true;
                                user.save((err) => {
                                    if (err) throw err;
                                });
                            }
                        }else {
                            console.tag("SALARIE").time().file().info(req.params.val);
                            res.status(200).json(recordset);

                            const newuser = new UserDcs({
                                code: recordset[0].SALCODE,
                                societe: recordset[0].SALSOCCODE,
                                connected:true
                            });
                            newuser.save(function(err) {
                                if (err) throw err;
                            });
                        }
                    });
                }
            });
    });
};
