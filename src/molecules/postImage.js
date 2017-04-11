const fs = require("fs");

module.exports = (router, console) =>{
//POST IMAGE
    router.post("/image", function(req, res) {
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
                res.end();
            });
        });
    });
};
