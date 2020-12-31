const express = require('express');
const nodemailer = require("nodemailer");

const app = express();

app.post("/sendemail", (req, res) => {
    let user = req.body;
    let email = user.email;
    let name = user.name;
    let message = user.message;

    if ((email === '' || email === undefined) || (name === '' || name === undefined) || (message === '' || message === undefined)) {
        return res.status(400).json({
            error: 'Formulario incompleto',
            message: 'Introduza todo los datos por favor...'
        });
    }

    sendMail(user, info => {
        res.status(200).json({info});
    });
});


async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PWDEMAIL
      }
    });
  
    let mailOptions = {
      from: user.email, // sender address
      to: process.env.EMAIL, // list of receivers
      subject: "Contact Final Store", // Subject line
      html: `<h1>From ${user.email}</h1><br>
      <h2>Name: ${user.name}</h2><br>
      <h2>Message: ${user.message}</h2>`
    };
  
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (err,info) => {
        if (err) {
            return res.status(500).json({
                error: err,
                message: 'Perdón algo ha salido mal'
            });
        }
    });
  
    callback(info);
  }


    module.exports = app;