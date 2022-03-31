const { response } = require('express');
const sendMail = require('./emailService');

const sendEmail = (req, res = response) => {
  const CORREO_REGX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/g;
  const user = req.body;
  const { email, name, message } = user;

  if ((name === '' || name === undefined) || (message === '' || message === undefined || message.trim() === '')) {
    return res.status(400).json({
      error: 'Formulario incompleto',
      message: 'Introduza todo los datos por favor...',
    });
  }
  if (!CORREO_REGX.test(email)) {
    return res.status(400).json({
      error: 'Formulario incorrecto',
      message: 'Correo incorrecto',
    });
  }

  return sendMail(user, (callback) => {
    if (callback) {
      if (callback.error) {
        return res.status(500).json(callback);
      }
      if (callback.ok) {
        return res.status(200).json({
          ok: true,
          message: 'Correo enviado correctamente',
        });
      }
    }
  });
};

module.exports = {
  sendEmail,
};
