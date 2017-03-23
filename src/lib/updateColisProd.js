const sql = require("mssql");
const conn = require("./../conn");

module.exports = function(numColis, action, user, zone) {
    return new Promise((resolve, reject) => {
        const req = new sql.Request(conn)
            .input("numColis", sql.NVarChar, numColis)
            .input("user", sql.NVarChar, user);
        switch (action) {
        case "chargement":
            req.query(`UPDATE ORDCOL
                    SET
                    OTLDTCHA = GETDATE(),
                    OTLQUICHA = @user
                    where OTLNUMCB = @numColis`,
                    err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
            break;
        case "dechargement":
            req.input("zone", sql.NVarChar, zone);
            req.query(`UPDATE ORDCOL
                        SET
                        OTLDTDEC = GETDATE(),
                        OTLQUIDEC = @user,
                        OTLCLASS = @zone
                        where OTLNUMCB = @numColis`,
                    err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
            break;
        case "inventaire":
            req.input("zone", sql.NVarChar, zone);
            req.query(`UPDATE ORDCOL
                            SET
                            OTLDTINV = GETDATE(),
                            OTLQUIINV = @user,
                            OTLCLASS = @zone
                            where OTLNUMCB = @numColis`,
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
