const sql = require("mssql");
const conn = require("./../conn");

module.exports = function (numColis, action, user, zone, societe) {
    return new Promise((resolve, reject) => {
        const req = new sql.Request(conn)
            .input("numColis", sql.NVarChar, numColis)
            .input("user", sql.NVarChar, user)
            .input("zone", sql.NVarChar, zone);
        switch (action) {
            case "chargement":
                req.query(`UPDATE ORDCOL
                    SET
                    OTLDTCHA = GETDATE(),
                    OTLQUICHA = @user,
                    OTLCLASS = @zone
                     where otlid in (select top 1 otlid from ordre inner join  ordcol on otlotsid=otsid where otlnumcb = @numColis and otssoccode like '${societe}%')`,
                    err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                break;
            case "dechargement":
                req.query(`UPDATE ORDCOL
                        SET
                        OTLDTDEC = GETDATE(),
                        OTLQUIDEC = @user,
                        OTLCLASS = @zone
                        where otlid in (select top 1 otlid from ordre inner join  ordcol on otlotsid=otsid where otlnumcb = @numColis and otssoccode like '${societe}%')`,
                    err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                break;
            case "inventaire":
                req.query(`UPDATE ORDCOL
                      SET
                      OTLDTINV = GETDATE(),
                      OTLQUIINV = @user,
                      OTLCLASS = @zone
                      where otlid in (select top 1 otlid from ordre inner join  ordcol on otlotsid=otsid where otlnumcb = @numColis and otssoccode like '${societe}%')`,
                    err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                break;
            default:
        }
    });
};
