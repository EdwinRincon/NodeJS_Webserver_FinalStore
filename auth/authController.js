const { response } = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const Usuario = require('../usuarios/usuarioDAL');
// const { sendMailResetPwd } = require('../email/emailService');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    await Usuario.findOne({ email: _.escape(email) }, (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          error: err,
          message: 'No se ha podido completar el login',
        });
      }
      if (!usuarioDB) {
        return res.status(400).json({
          message: 'Usuario o contraseña incorrectos',
        });
      }
      if (!bcrypt.compareSync(_.escape(password), usuarioDB.password)) {
        return res.status(400).json({
          message: 'Usuario o contraseña incorrectos',
        });
      }
      const usuarioFilter = _.pick(usuarioDB, ['name', 'email', 'role', 'image']);
      // Si hay un usuario encontrado y credenciales correctas
      const token = jwt.sign(
        {
          usuario: usuarioFilter,
        },
        process.env.SEED,
        { expiresIn: process.env.CADUCIDAD_TOKEN },
      );

      return res.cookie('token', token, {
        maxAge: 28800000,
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
        .status(200)
        .json({
          message: 'Sesión Iniciada',
        });
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const logout = (req, res = response) => {
  res.clearCookie('token').status(200).json({
    message: 'Sesión Cerrada',
  });
};

const hasPermission = (req, res = response) => {
  const token = req.cookies?.token;

  jwt.verify(token, process.env.SEED, (err) => {
    if (err) {
      return res.status(200).json(false);
    }
    return res.status(200).json(true);
  });
};

/**
 * Check this out
 * @param {password, _id} req
 * @return {response}
 */
// const resetPwd = (req, res = response) => {
//     let password = _.escape(req.body.password);
//     let id = _.escape(req.usuario._id);

//     Usuario.findByIdAndUpdate(id, { password }, (err, usuarioActualizado) => {
//         if (err) {
//             return res.status(500).json({
//                 error: err,
//                 message: 'Password reset failed'
//             });
//         }
//         if (!usuarioActualizado) {
//             return res.status(500).json({
//                 error: err,
//                 message: 'Password reset failed'
//             });
//         }
//         res.json({
//             success: true,
//             message: 'Password reset successful'
//         });
//     });
// }

/**
 * Check this out
 *
 * Emails the person if forgot the 'pwd' with a @type {token}
 * @param {email} req
 * @return {response}
 */
// const forgot = (req, res= response) => {
//     const body = req.body;

//     Usuario.findOne({ email: _.escape(body.email) }, (err, usuarioDB) => {
//         if (err) {
//             return res.status(400).json({
//                 error: err,
//                 message: 'No se ha podido completar el proceso'
//             })
//         }
//         if (!usuarioDB) {
//             return res.status(400).json({
//                 message: 'Usuario o contraseña incorrectos'
//             });
//         }
//         let usuarioFilter = _.pick(usuarioDB, ['_id']);
//         // Si hay un usuario encontrado y credenciales correctas
//         let token = jwt.sign(
//             {
//                 usuario: usuarioFilter,
//             },
//             process.env.SEED,
//             { expiresIn: process.env.CADUCIDAD_TOKEN }
//         );

//         sendMailResetPwd(body.email, token, info => {
//             if (info?.error) {
//                 res.status(500).json({
//                     error: info.error,
//                     message: info.message
//                 })
//             }

//             res.status(200).json({
//                 ok: true,
//                 message: 'Correo enviado correctamente'
//             })
//         });
//     });

// }

module.exports = {
  login,
  logout,
  hasPermission,
};
