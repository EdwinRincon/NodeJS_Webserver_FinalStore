
const express = require('express');
const nodemailer = require("nodemailer");

const app = express();

app.post("/sendemail", (req, res) => {

    const CORREO_REGX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/g;
    let user = req.body;
    let { email, name, message } = user;


    if ((name === '' || name === undefined) || (message === '' || message === undefined || message.trim() === '')) {
        return res.status(400).json({
            error: 'Formulario incompleto',
            message: 'Introduza todo los datos por favor...'
        });
    }
    if (!CORREO_REGX.test(email)) {
        return res.status(400).json({
            error: 'Formulario incorrecto',
            message: 'Correo incorrecto'
        });
    }


    sendMail(user, info => {
        if (info?.error) {
            res.status(500).json({
                error: info.error,
                message: info.message
            })
        }

        res.status(200).json({
            ok: true,
            message: 'Correo enviado correctamente'
        })
    });
});


async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PWDEMAIL
        }
    });

    let mailOptions = {
        from: user.email, // sender address
        to: process.env.EMAIL, // list of receivers
        subject: "Contact Final Store", // Subject line
        html: `<h1>De: ${user.email}</h1><br>
      <h2>Nombre: ${user.name}</h2><br>
      <h2>Mensaje: ${user.message}</h2>`
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return callback({
                error: 'Error al enviar el correo',
                message: 'Perdón algo ha salido mal'
            });
        }
    });

    callback(info);
}


module.exports = app;