const { response } = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const Usuario = require('../usuarios/usuarioDAL');
const { sendMailResetPwd } = require('../email/emailService');

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
      if (!bcrypt.compareSync(password, usuarioDB.password)) {
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
 * Emails the person if forgot the 'password' with a @type {token}
 * @param {email} req
 * @return {response}
 */
const forgot = (req, res = response) => {
  const { email } = req.body;

  Usuario.findOne({ email }, async (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        error: err,
        message: 'No se ha podido completar el proceso',
      });
    }
    if (!usuarioDB) {
      return res.status(400).json({
        message: 'Este email no está registrado',
      });
    }

    const usuarioFilter = _.pick(usuarioDB, ['_id']);
    const token = jwt.sign(
      {
        usuario: usuarioFilter,
      },
      process.env.SEED,
      { expiresIn: '1h' },
    );

    return sendMailResetPwd(email, token, (callback) => {
      if (callback) {
        if (callback.error) {
          return res.status(500).json(callback);
        }
        if (callback.ok) {
          return res.status(200).json({
            ok: true,
            message: 'Se ha enviado un enlace a tu correo donde podrás cambiar tu contraseña',
          });
        }
      }
    });
  });
};

/**
 * @param {password, _id} req
 * @return {response}
 */
const resetPwd = async (req, res = response) => {
  const { password } = req.body;
  const id = req.usuario._id;

  const passwordEncrypt = await bcrypt.hash(password, 10).catch((err) => res.status(500).json(err));

  Usuario.findByIdAndUpdate(id, { password: passwordEncrypt }, (err, usuarioActualizado) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: 'Fallo al cambiar la contraseña',
      });
    }
    if (!usuarioActualizado) {
      return res.status(500).json({
        error: 'Cuenta inexistente',
        message: 'Fallo al cambiar la contraseña',
      });
    }
    return res.json({
      success: true,
      message: 'Reinicio de contraseña exitoso',
    });
  });
};

module.exports = {
  login,
  logout,
  hasPermission,
  forgot,
  resetPwd,
};
