const sql = require("mssql");
const conn = require("./../conn");
module.exports = function(idPosition) {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
            .input("idPosition", sql.Int, idPosition)
            .query(`select
                    OTETEVCODE as code,
                    OTETEVLIBCL1 as libelle,
                    OTEDATE as date,
                    OTEVAL3 as remarque,
                    OTEVAL1 as information
                    from ORDEVE
                    where OTEOTSID = @idPosition
                    order by OTEID desc`,
                (err, recordset) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(recordset);
                });
    });
};
