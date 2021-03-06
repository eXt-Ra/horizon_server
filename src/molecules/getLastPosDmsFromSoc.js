const sql = require("mssql");
const moment = require("moment");
const conn = require("./../conn");
// const moment = require("moment");
const chauffColor = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548"];

module.exports = (router) => {
    router.get("/getLastPosDmsSoc", (req, res) => {

        new sql.Request(conn)
      .query(`select
            DCOCODECONDUCTEUR as chauffeur,
            DGPDERNIEREPOS as lastPos,
            DGPDERNIEREHEURE as lastTime
            from DMSCONDUCTEUR cond, SALARIE sal, DMSGPS gps
            where DCOSOCID in (select SOCIDSUP from SOCIETE where socid= 3)
            and SALCODE=DCOCODECONDUCTEUR
            and gps.DGPCOND = DCOCODECONDUCTEUR
            and DGPDATE = '${moment().format("MM/DD/YYYY")}'
            and (SALDIV5='' or SALDIV5 is null OR SALDIV5='MJU39')
            ORDER By DCONOMCONDUCTEUR`,
        (err, recordset) => {
            if (err) {
                res.status(505).send(err);
            }
            const response = [];
            if (recordset != undefined) {
                let i =0;
                recordset.forEach(line => {
                    const newLine = {
                        chauffeur: line.chauffeur,
                        lastPos: {
                            lat: Number(line.lastPos.replace(",", ".").replace(",", ".").split(";")[0]),
                            lng: Number(line.lastPos.replace(",", ".").replace(",", ".").split(";")[1])
                        },
                        lastTime: line.lastTime,
                        color : chauffColor[i]
                    };
                    response.push(newLine);
                    i++;
                });
                res.json(response);
            }
        });
    });
};
