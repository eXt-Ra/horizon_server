const sql = require("mssql");
const conn = require("./../conn");
const moment = require("moment");

module.exports = code => {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
              .input("code", sql.NVarChar, code)
              .query(`select
                      OTPTRSCODE as type,
                      count(distinct(otpid)) as nbPosition ,
                      count(distinct(dbo.DMSSUIVILIV.DMSUIVIOTSNUM)) AS nbFait
                      from DMSCONDUCTEUR , voyage , ordpla , DMSSUIVILIV
                      where dbo.DMSSUIVILIV.DMSSUIVIVOYBDX=voybdx
                      and dbo.VOYAGE.VOYID=otpvoyid
                      and dbo.DMSSUIVILIV.DMSUIVIOTSNUm=*otpotsnum
                      and VOYCHSALCODE = dbo.DMSCONDUCTEUR.DCOCODECONDUCTEUR
                      AND datediff(day, VOYDEPDTDEB, '${moment().format("MM/DD/YYYY")}') = 0
                      AND dbo.DMSCONDUCTEUR.DCOCODECONDUCTEUR = @code
                      group by  dcocodeconducteur,OTPTRSCODE`,
                  (err, recordset) => {
                      if (err) {
                          reject(err);
                      }
                      resolve(recordset);
                  });
    });
};
