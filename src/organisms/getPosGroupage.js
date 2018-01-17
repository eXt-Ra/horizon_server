const sql = require("mssql");
const conn = require("../conn");
const moment = require("moment");
const getColisProdTable = require("../molecules/getColisProdTable");
const getEventProd = require("../molecules/getEventProd");

module.exports = (router) => {
    router.get("/posgroupage/:numero", (req, res) => {
        return new Promise((resolve, reject) => {
            new sql.Request(conn)
                .input("num", sql.NVarChar, req.params.numero)
                .query(`select POS.OTSID as idPosition,
                        POS.OTSNUM as numPosition,
                        POS.OTSREF as refClient,
                        POS.OTSCOL as nbColis,
                        COALESCE(POS.OTSPAL, 0) as nbPalette,
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
                        POS.OTSARRUSRVILCP as livraisonCp
                        from voyage  
                        inner join ordpla
                        on voyid=otpvoyid                      
                        inner join ordre as POS
                        on otpotsid = otsid                   
                        where OTPTRSCODE<>'RAM' and  voybdx = @num
                        order by OTPMANVOYPOS`,
                    (err, recordset) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(recordset);
                    });
        }).then(result => {
            let promiseQ = [];
            result.forEach(pos => {
                pos.codebarre =[];
                promiseQ.push( new Promise(resolve =>{
                    getColisProdTable(pos.idPosition).then(codebarre => {
                        pos.codebarre = codebarre;
                        getEventProd(pos.idPosition).then( events =>{
                            pos.evenement = events;
                            resolve();
                        });
                    })

                }))

            });
            Promise.all(promiseQ).then(()=>{
                res.json(result);
            })

        })
    });
};


// SELECT
// DMSMANVOYPOS as ordrePosition,
// DMSOTPID as idPosition,
// DMSOTSNUM as numPosition,
// DMSOTSREF as refClient,
// DMSCOL as nbColis,
// COALESCE (DMSPAL, 0) as nbPalette,
// DMSPDS as poids,
// DMSNOMCLIENT as clientNom,
// DMSEXPNOM as expediteurNom,
// DMSEXPADR as expediteurAdresse,
// DMSEXPVILLIB as expediteurVille,
// DMSEXPVILCP as expediteurCp,
// DMSLIVNOM as livraisonNom,
// DMSLIVADR as livraisonAdresse,
// DMSLIVVILLIB as livraisonVille,
// DMSLIVVILCP as livraisonCp
// FROM DMSDEALTIS
// WHERE DMSVOYBDX = @num
