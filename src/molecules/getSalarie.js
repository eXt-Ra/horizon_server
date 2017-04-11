const sql = require("mssql");
const conn = require("./../conn");
//GET SALARIE
module.exports = (router, console) =>{
    router.get("/salarie/:val", (req, res) => {
        new Promise((resolve, reject) => {
            new sql.Request(conn).input("val", sql.NVarChar, req.params.val)
            .query("SELECT TOP 1 SALCODE,SALNUMPERMIS, SALSOCCODE FROM SALARIE WHERE SALCODE=@val OR SALNUMPERMIS=@val", function(err, recordset) {
                if (err) {
                    console.tag("SALARIE").time().file().error(err);
                    reject(err);
                }
                console.tag("SALARIE").time().file().info(req.params.val);
                resolve(recordset);
            });
        }).then(result => {
            res.json(result);

        }).catch(err => {
            res.json({
                error: err
            });
        });
    });
};
