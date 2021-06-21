const nodemailer = require('nodemailer');

function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PWDEMAIL,
    },
  });

  const mailOptions = {
    from: user.email, // sender address
    to: process.env.EMAIL, // list of receivers
    subject: 'Contact Final Store', // Subject line
    html: `<h1>De: ${user.email}</h1><br>
    <h2>Nombre: ${user.name}</h2><br>
    <h2>Mensaje: ${user.message}</h2>`,
  };

  // send mail with defined transport object
  const info = transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return callback({
        error: 'Error al enviar el correo',
        message: 'Perdón algo ha salido mal',
      });
    }
    return callback({
      ok: 'Correo enviado',
      message: 'Todo ha salido bien',
    });
  });

  callback(info);
}

const sendMailResetPwd = async (email, token, callback) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PWDEMAIL,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: 'Reset Password Request', // Subject line
    text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
      + `https://ecommerce-final-d64fc.web.app/change?token=${token}`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
  };

  // send mail with defined transport object
  const info = transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return callback({
        error: 'Error al enviar el correo',
        message: 'Perdón algo ha salido mal',
      });
    }
    return callback({
      ok: 'Correo enviado',
      message: 'Todo ha salido bien',
    });
  });

  callback(info);
};

module.exports = {
  sendMailResetPwd,
  sendMail,
};
