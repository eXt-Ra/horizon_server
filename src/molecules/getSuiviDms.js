const sql = require("mssql");
const conn = require("./../conn");
const moment = require("moment");

module.exports = dms => {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
              .input("dms", sql.NVarChar, dms)
              .query(`SELECT
                      DMSOTSNUM as numeroPos,
                      DMSUIVICODEANO as codeEvent,
                      DMSNOMCLIENT as clientNom
                      FROM DMSSUIVILIV,DMSDEALTIS
                      WHERE DMSOTSNUM = DMSUIVIOTSNUM
                      AND DMSVOYBDX = DMSSUIVIVOYBDX
                      AND DMSCODECHAUFFEUR = @dms
                      AND datediff(day, DMSUIVIDATE, '${moment().format("MM/DD/YYYY")}') = 0
                      ORDER BY DMSUIVIDATE desc`,
                  (err, recordset) => {
                      if (err) {
                          reject(err);
                      }
                      resolve(recordset);
                  });
    });
};
