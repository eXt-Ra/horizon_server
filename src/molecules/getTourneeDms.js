const sql = require("mssql");
const conn = require("./../conn");
const moment = require("moment");

module.exports = userdms => {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
              .input("userdms", sql.NVarChar, userdms)
              .query(`SELECT 
                        DMSCODECHAUFFEUR as codeChauffeur,
                        DMSVOYBDX as groupage,
                        DMSOTSNUM as numPosition,
                        DMSPDS as poids,
                        DMSLIVNOM as nomLivraison,
                        DMSLIVADR as adresseLivraison,
                        DMSLIVVILCP as cpLivraison,
                        DMSLIVVILLIB as villeLivraison,
                        DMSEXPADR as adresseExpedition,
                        DMSEXPNOM as nomExpedition,
                        DMSEXPVILCP as cpExpedition,
                        DMSEXPVILLIB as villeExpedition,                        
                        DMSMANVOYPOS as ordrePosition,
                        DMSPAL as nbPalette,
                        DMSCOL as nbColis,
                        DMSTRSCODE as type
                        FROM DMSDEALTIS
                        WHERE DMSCODECHAUFFEUR = @userdms
                        AND datediff(day, DMSEXPDATE, '${moment().format("MM/DD/YYYY")}') = 0`,
                  (err, recordset) => {
                      if (err) {
                          reject(err);
                      }
                      resolve(recordset);
                  });
    });
};
