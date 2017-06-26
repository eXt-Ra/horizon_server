const sql = require("mssql");
const conn = require("./../conn");

module.exports = (router, console) =>{
//GET ZONES
    router.get("/zones/:soc", (req, res) => {
        new Promise((resolve, reject) => {
            new sql.Request(conn).input("val", sql.NVarChar, req.params.soc)
            .query(`SELECT
                    QUACODEL1 as codeZone,
                    QUALIBL1 as libZone
                    FROM QUAI
                    WHERE QUASOCCODE LIKE @val`,
                (err, recordset) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    console.info(`Resquest Zones for ${req.params.soc}`);
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
