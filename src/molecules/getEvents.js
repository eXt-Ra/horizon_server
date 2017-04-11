const sql = require("mssql");
const conn = require("./../conn");

module.exports = (router, console) =>{
//GET EVENTS
    router.get("/events", (req, res) => {
        new Promise((resolve, reject) => {
            new sql.Request(conn)
            .query(`select
                    TEVLIBCL1 as code,
                    TEVLIBL1 as libelle
                    from OTETYPE where TEVQUAI = 1`,
                (err, recordset) => {
                    if (err) {
                        console.tag("EVENTS").time().file().error(err);
                        reject(err);
                    }
                    console.tag("EVENTS").time().file().info("GET EVENTS");
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
