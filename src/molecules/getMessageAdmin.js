const sql = require("mssql");
const conn = require("./../conn");

module.exports = code => {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
              .input("nom", sql.NVarChar, code)
              .query(`select top 3
                      DMEID as id,
                      DMEMESSAGE as message,
                      DMEDATERECU as dateRecu
                      from DMSMESSAGE where DMSMESSAGE.DMECODECHAUF = @nom
                      and DMETYPE = 5
                      order by DMSMESSAGE.DMEDATEC desc`,
                  (err, recordset) => {
                      if (err) {
                          reject(err);
                      }
                      resolve(recordset);
                  });
    });
};
