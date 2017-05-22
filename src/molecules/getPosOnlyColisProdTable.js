const sql = require("mssql");
const conn = require("./../conn");
const s = `select
            POS.OTSID as idPosition,
            POS.OTSNUM as numPosition,
            POS.OTSREF as refClient,
            POS.OTSCOL as nbColis,
            POS.OTSPAL as nbPalette,
            POS.OTSPDS as poids,
            COALESCE(POS.OTSLONG, 0) as ml,
            COALESCE(POS.OTSDIV2, 0) as col,
            COALESCE(POS.OTSUNI03, 0) as colisSurPal,
            COALESCE(POS.OTSDTLIM, CAST('1900-01-01 00:00' AS DATETIME)) as dateImpLiv,
            POS.OTSTIENOM as clientNom,
            POS.OTSREMITTIENOM as expediteurNom,
            POS.OTSREMITADR1 as expediteurAdresse,
            POS.OTSREMITVILLIB as expediteurVille,
            POS.OTSREMITVILCP as expediteurCp,
            POS.OTSTIENOM as chargementNom,
            POS.OTSDEPADR1 as chargementAdresse,
            POS.OTSDEPUSRVILLIB as chargementVille,
            POS.OTSDEPUSRVILCP as chargementCp,
            POS.OTSARRNOM as livraisonNom,
            POS.OTSARRADR1 as livraisonAdresse,
            POS.OTSARRUSRVILLIB as livraisonVille,
            POS.OTSARRUSRVILCP as livraisonCp,
            QUALIBL1 AS zoneQuaiTheorique`;
module.exports = function(num, societe) {
    return new Promise((resolve, reject) => {
        new sql.Request(conn)
            .input("numColis", sql.NVarChar, num)
            .query(`${s} from dbo.ORDRE as POS, dbo.ORDCOL as COL ,  QUAI,TOURNEEVILLE
                where POS.OTSID = COL.OTLOTSID
                AND COL.OTLNUMCB=@numColis
                AND POS.OTSSOCCODE like '${societe}%'
                AND  otsarrvilid*= TOUVILID AND OTSVPECODE*=QUAVTOCODE and QUASOCCODE='${societe}';`,
                (err, recordset) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(recordset);
                });
    });
};
