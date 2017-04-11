const sql = require("mssql");
const conn = require("./../conn");
module.exports = function(idPosition, societe) {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
            .input("idPosition", sql.Int, idPosition)
            .query(`select
                    OTLNUMCB as numero,
                    COALESCE(OTLDTDEC, CAST('1900-01-01 00:00' AS DATETIME)) as dateDechargement,
                    COALESCE(OTLDTCHA, CAST('1900-01-01 00:00' AS DATETIME)) as dateChargement,
                    COALESCE(OTLDTINV, CAST('1900-01-01 00:00' AS DATETIME)) as dateInventaire,
                    OTLQUIDEC as quiDechargement,
                    OTLQUICHA as quiChargement,
                    OTLQUIINV as quiInventaire,
                    OTLCLASS as zoneDeQuai
                    from QUAI_${societe} WHERE OTLOTSID=@idPosition`,
                (err, recordset) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(recordset);
                });
    });
};
