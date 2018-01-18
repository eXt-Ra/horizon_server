const request = require("request");
const moment = require("moment");

module.exports = (codeEvent,libEvent, remarque, user, idPosition, storage) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "POST",
            url: "http://10.1.2.70/DCSAPP/api/creaeve",
            headers: {
                "cache-control": "no-cache",
                "content-type": "application/json",
                "x-access-token": "w25K}54dkaE/[dgduVqcX9VicQF17u"
            },
            body: {
                EVECODE: codeEvent,
                EVELIB: libEvent,
                EVEDATE: moment().format("DD/MM/YYYY"),
                EVEOTEVAL1: remarque,
                EVEQUIC: user,
                EVEOTSID: idPosition,
                EVETABLE: "ORDRE"
            },
            json: true
        };
        console.log(`{
            EVECODE: ${codeEvent},
            EVELIB: ${libEvent},
            EVEDATE: ${moment().format("DD/MM/YYYY")},
            EVEOTEVAL1: ${remarque},
            EVEQUIC: ${user},
            EVEOTSID: ${idPosition},
            EVETABLE: "ORDRE"
        }`);
        request(options, (error,response, body) => {
            if (error){
                reject(error);
            }else {
                if(storage != null){
                    const sch = storage.values().find((o) => {
                        return o.idPosition == idPosition;
                    });

                    if (sch != undefined) {
                        sch.evenement.push({
                            "information": "",
                            "remarque": remarque,
                            "date": moment().format(),
                            "libelle": libEvent,
                            "code": codeEvent,
                            "source": "DCS",
                            "eventuser": user
                        });
                        storage.setItem(sch.numPosition, sch);
                    }
                }
                resolve(body);
            }
        });
    });
};
