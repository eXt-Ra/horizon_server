const sql = require("mssql");
const conn = require("./../conn");

module.exports = dms => {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
              .input("codedms", sql.NVarChar, dms)
              .query(`select
                  DCONOMCONDUCTEUR as nom,
                  DCOSOCCODE as nomsociete,
                  DCOCODECONDUCTEUR as code,
                  DCOIMEI as imei
                  from DMSCONDUCTEUR where DCOTRANSICSCODE = @codedms`,
                  (err, recordset) => {
                      if (err) {
                          reject(err);
                      }
                      resolve(recordset);
                  });
    });
};
