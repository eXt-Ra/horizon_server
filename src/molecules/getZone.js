const sql = require("mssql");
const conn = require("./../conn");

module.exports = (router) =>{
//GET ZONE
    router.get("/zone/:val", (req, res) => {
        new Promise((resolve, reject) => {
            new sql.Request(conn).input("val", sql.NVarChar, req.params.val)
            .query(`SELECT
                    QUACODEL1 as codeZone,
                    QUALIBL1 as libZone
                    FROM QUAI
                    WHERE QUASOCCODE LIKE '${req.query.societe}'
                    AND QUACODEL1 = @val`,
                (err, recordset) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    resolve(recordset);
                });
        }).then(result => {
            res.json(result[0]);
        }).catch(err => {
            res.json({
                error: err
            });
        });
    });
};
