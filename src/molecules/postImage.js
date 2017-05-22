const fs = require("fs");
const Client = require("ftp");

const connectionProperties = {
    host: "10.1.2.75",
    user: "DMS",
    password: "Linuxr00tn"
};

module.exports = (router, console) => {
  //POST IMAGE
    router.post("/image", function(req, res) {
        const c = new Client();
        let fstream;
        req.pipe(req.busboy);
        req.busboy.on("file", (fieldname, file, filename) => {
            console.tag("UPLOAD_IMG").time().file().info(`Start upload ${filename}`);
            fstream = fs.createWriteStream("images/" + filename);
            file.pipe(fstream);

            fstream.on("error", err => {
                console.tag({
                    msg: "UPLOAD_IMG",
                    colors: ["blue", "bold"]
                }).time().file().error(err);
                res.status(500).send(err);
            });

            fstream.on("finish", () => {
                console.tag({
                    msg: "UPLOAD_IMG",
                    colors: ["blue", "bold"]
                }).time().file().info(`Finish upload ${filename}`);

                c.on("ready", function() {
                    c.put("images/" + filename, filename.replace(".jpg", "-1_1.jpg"), function(err) {
                        if (err) throw err;
                        console.log(`put de ${filename}`);
                        c.end();
                    });
                });

                c.connect(connectionProperties);
                res.end();
            });
        });
    });
};
