const sql = require("mssql");
const conn = require("./../conn");

module.exports = function(num) {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
                .input("numColis", sql.NVarChar, num)
                .query(`select
                          OTSID as idPosition,
                          OTSNUM as numPosition,
                          OTSREF as refClient,
                          OTSCOL as nbColis,
                          OTSPAL as nbPalette,
                          OTSPDS as poids,
                          COALESCE(OTSLONG, 0) as ml,
                          COALESCE(OTSDIV2, 0) as col,
                          COALESCE(OTSUNI03, 0) as colisSurPal,
                          COALESCE(OTSDTLIM, CAST('1900-01-01 00:00' AS DATETIME)) as dateImpLiv,
                          OTSTIENOM as clientNom,
                          OTSREMITTIENOM as expediteurNom,
                          OTSREMITADR1 as expediteurAdresse,
                          OTSREMITVILLIB as expediteurVille,
                          OTSREMITVILCP as expediteurCp,
                          OTSTIENOM as chargementNom,
                          OTSDEPADR1 as chargementAdresse,
                          OTSDEPUSRVILLIB as chargementVille,
                          OTSDEPUSRVILCP as chargementCp,
                          OTSARRNOM as livraisonNom,
                          OTSARRADR1 as livraisonAdresse,
                          OTSARRUSRVILLIB as livraisonVille,
                          OTSARRUSRVILCP as livraisonCp,
                          QUALIBL1 as zoneDeQuaiTheorique
                          from QUAI_STJ25
                          where OTLNUMCB=@numColis
                          UNION
                          select
                          OTSID as idPosition,
                          OTSNUM as numPosition,
                          OTSREF as refClient,
                          OTSCOL as nbColis,
                          OTSPAL as nbPalette,
                          OTSPDS as poids,
                          OTSLONG as ml,
                          OTSDIV2 as col,
                          OTSUNI03 as colisSurPal,
                          OTSDTLIM as dateImpLiv,
                          OTSTIENOM as clientNom,
                          OTSREMITTIENOM as expediteurNom,
                          OTSREMITADR1 as expediteurAdresse,
                          OTSREMITVILLIB as expediteurVille,
                          OTSREMITVILCP as expediteurCp,
                          OTSTIENOM as chargementNom,
                          OTSDEPADR1 as chargementAdresse,
                          OTSDEPUSRVILLIB as chargementVille,
                          OTSDEPUSRVILCP as chargementCp,
                          OTSARRNOM as livraisonNom,
                          OTSARRADR1 as livraisonAdresse,
                          OTSARRUSRVILLIB as livraisonVille,
                          OTSARRUSRVILCP as livraisonCp,
                          QUALIBL1 as zoneDeQuaiTheorique
                          from QUAI_STJ25
                          WHERE OTSNUM=@numColis;`,
                          (err, recordset) => {
                              if (err) {
                                  reject(err);
                              }
                              resolve(recordset);
                          });
    });
};

// AND POS.OTSSOCCODE like 'STJ25%'
