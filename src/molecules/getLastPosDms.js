const sql = require("mssql");
const conn = require("./../conn");
// const moment = require("moment");
const chauffColor = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#00bcd4", "#ffc107", "#ff9800", "#ff5722", "#795548"];


module.exports = (router) => {
    router.get("/getLastPosDms", (req, res) => {
        new sql.Request(conn)
      .query(`SELECT DGPCOND as chauffeur,
                DGPDERNIEREPOS as lastPos,
                DGPDERNIEREHEURE as lastTime
                FROM DMSGPS
                WHERE DGPDATE = '06/21/2017'`,
        (err, recordset) => {
            if (err) {
                res.status(505).send(err);
            }
            const response = [];
            if (recordset != undefined) {
                let i =0;
                recordset.forEach(line => {
                    let color = "";
                    if (chauffColor[i] != undefined) {
                        color = chauffColor[i];
                    }
                    const newLine = {
                        chauffeur: line.chauffeur,
                        lastPos: {
                            lat: Number(line.lastPos.replace(",", ".").replace(",", ".").split(";")[0]),
                            lng: Number(line.lastPos.replace(",", ".").replace(",", ".").split(";")[1])
                        },
                        lastTime: line.lastTime,
                        color : color
                    };
                    response.push(newLine);
                    i++;
                });
                res.json(response);
            }
        });
    });
};
