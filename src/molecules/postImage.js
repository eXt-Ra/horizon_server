const Client = require("ftp");

const fs = require('fs')
    , gm = require('gm');

const connectionProperties = {
    host: "10.1.2.75",
    user: "DMS",
    password: "Linuxr00tn"
};

module.exports = (router, console) => {
    //POST IMAGE
    router.post("/image", function (req, res) {
        const c = new Client();
        let fstream;
        req.pipe(req.busboy);
        req.busboy.on("file", (fieldname, file, filename) => {
            console.info(`Start upload ${filename}`);
            fstream = fs.createWriteStream("images/" + filename);
            file.pipe(fstream);

            fstream.on("error", err => {
                console.error(err);
                res.status(500).send(err);
            });

            fstream.on("finish", () => {
                console.info(`Finish upload ${filename}`);
                c.on("ready", function () {
                    gm("images/" + filename)
                        .size(function (err, size) {
                            if (!err){
                                gm(size.width, 400, "#212121")
                                    .font("Helvetica.ttf", 400 / 4)
                                    .fill("#76ff03")
                                    .drawText(200, 220, req.query.remarque)
                                    .write("images/txt/" + filename, function (err) {
                                        debugger;
                                        gm("images/" + filename).append("images/txt/" + filename)
                                            .write("images/" + filename, function (err) {
                                                c.put("images/" + filename, filename.replace(".jpg", "-1_1.jpg"), function(err) {
                                                    if (err) throw err;
                                                    console.info(`put de ${filename}`);
                                                    c.end();
                                                });
                                            });
                                    });
                            }
                        });

                });

                c.connect(connectionProperties);
                res.end();
            });
        });
    });
};
