const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuthClient = new google.auth.OAuth2(process.env.CLIENT_ID_GMAIL,
  process.env.SECRET_ID_GMAIL,
  process.env.REDIRECT_URI);
oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(user, callback) {
  const accessToken = await oAuthClient.getAccessToken();
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID_GMAIL,
      clientSecret: process.env.SECRET_ID_GMAIL,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
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
  const accessToken = await oAuthClient.getAccessToken();
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID_GMAIL,
      clientSecret: process.env.SECRET_ID_GMAIL,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: 'Reset Password Request', // Subject line
    text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
      + `https://final-store-nws.herokuapp.com/#/auth/resetPwd?token=${token}`
      + '\nIf you did not request this, please ignore this email and your password will remain unchanged.\n',
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
