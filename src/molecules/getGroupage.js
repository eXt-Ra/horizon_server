const sql = require("mssql");
const conn = require("./../conn");

module.exports = num => {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
            .input("numero", sql.NVarChar, num)
            .query(`select TOP 1
                DMSVOYBDX as numero,
                DMSCODECHAUFFEUR as dms,
                DMSDTEXPORT as dateRecu,
                DMSDATEIMPORT as dateImport
                from DMSDEALTIS where DMSDEALTIS.DMSVOYBDX = @numero`,
                (err, recordset) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(recordset);
                });
    });
};
