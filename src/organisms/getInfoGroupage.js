const getGroupage = require("./../molecules/getGroupage");
const getChauffeur = require("./../molecules/getChauffeur");
const getMessageAdmin = require("./../molecules/getMessageAdmin");
const getSuiviDms = require("./../molecules/getSuiviDms");
const getProgressDms = require("./../molecules/getProgressDms");

module.exports = (router, console) => {
    //GET INFO GROUPAGE
    const dataGrp = {
        numero: 0,
        societe: "",
        chauffeur: {
            nom: "name",
            code: "",
            imei: 0,
            dms: "smart_"
        },
        dateImport: "",
        dateRecu: "",
        message: [],
        position: [],
        progressBar:[]
    };
    router.get("/infogroupage/:numero", (req, res) => {
        getGroupage(req.params.numero)
        .then(result => {
            dataGrp.numero = result[0].numero;
            dataGrp.chauffeur.dms = result[0].dms;
            dataGrp.dateImport = result[0].dateImport;
            dataGrp.dateRecu = result[0].dateRecu;
            return getChauffeur(result[0].dms);
        }).then(result => {
            dataGrp.chauffeur.nom = result[0].nom;
            dataGrp.chauffeur.code = result[0].code;
            dataGrp.chauffeur.imei = result[0].imei;
            dataGrp.societe = result[0].nomsociete;
            return getMessageAdmin(result[0].code);
        }).then(result => {
            dataGrp.message = result;
            return getSuiviDms(dataGrp.chauffeur.dms);
        }).then(result => {
            dataGrp.position = result;
            getProgressDms(dataGrp.chauffeur.code).then(result => {
                dataGrp.progressBar = result;
                res.json(dataGrp);
                console.tag({
                    msg: "INFOGRP",
                    colors: ["italic", "blue", "bold"]
                }).time().file().info(req.params.numero);
            });
        }).catch(err => {
            console.error({
                msg: "INFOGRP",
                colors: ["italic", "red", "bold"]
            }).time().file().info(req.params.numero);
            res.json({
                error: err
            });
        });
    });
};