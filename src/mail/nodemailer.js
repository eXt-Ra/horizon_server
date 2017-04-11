const mail = require("./startMail");
const nodemailer = require("nodemailer");

const smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "servernode.dcs@gmail.com",
        pass: "8Ed-xZs-2Bo-t2q"
    }
};
const transporter = nodemailer.createTransport(smtpConfig);

transporter.sendMail(mail.mailOptions);
