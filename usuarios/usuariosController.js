const { response } = require('express');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const Usuario = require('./usuarioDAL');

const getUsuarios = (req, res = response) => {
  let {
    desde = 0, limite = 5, ordenar = 'asc', search = '',
  } = req.query;

  desde = Number(desde);
  limite = Number(limite);
  ordenar = String(ordenar);
  search = String(search);

  const usuarios = {
    $or: [
      { name: { $regex: _.escape(search), $options: 'i' } },
      { lastName: { $regex: _.escape(search), $options: 'i' } },
      { email: { $regex: _.escape(search), $options: 'i' } },
    ],
  };

  Usuario.find(usuarios)
    .sort({ name: ordenar })
    .skip(desde)
    .limit(limite)
    .exec((err, usuariosDB) => {
      if (err) {
        return res.status(500).json({
          error: err,
          message:
            'Ha habido un error, por favor comunicate en la zona de contacto',
        });
      }
      const usuariosFilter = usuariosDB.map((usr) => _.pick(usr, ['role', 'name', 'lastName', 'email']));

      return res.json({
        usuarios: usuariosFilter,
      });
    });
};

const getUsuario = async (req, res = response) => {
  const EMAIL = req.params.email;

  await Usuario.findOne({ email: EMAIL }, (err, usuarioDB) => {
    if (usuarioDB === null) {
      return res.status(400).json({
        error: err,
        message: 'Credenciales erroneas',
      });
    }
    const usuarioFilter = _.pick(usuarioDB, [
      'role',
      'name',
      'lastName',
      'email',
    ]);
    res.json(usuarioFilter);
  });
};

const postUsuario = async (req, res = response) => {
  const {
    name, lastName, email, role,
  } = req.body;
  let { password } = req.body;

  await Usuario.findOne({ email }, (err, usuarioDB) => {
    if (usuarioDB) {
      return res.status(400).json({
        error: `${req.body.email}, está en uso. Intenta iniciar sesión o utiliza otro correo para crear la cuenta`,
      });
    }
  });

  password = await bcrypt.hash(password, 10).catch((err) => { console.log(err); });
  const usuario = new Usuario({
    name, lastName, email, password, role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        message: 'No se puede guardar el usuario',
        error: err.message.split(','),
      });
    }

    const usuarioFilter = _.pick(usuarioDB, ['role', 'name', 'lastName', 'email']);

    res.json({
      ok: true,
      usuario: usuarioFilter,
    });
  });
};

const putUsuario = (req, res = response) => {
  const oldEmail = req.params.email;
  const {
    role, estate, name, lastName, email: newEmail,
  } = req.body;

  let { password } = req.body;

  Usuario.findOne({ email: oldEmail }, async (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'No se pudó actualizar el usuario',
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        error: true,
        message: 'No se pudó actualizar el usuario',
      });
    }

    usuarioDB.role = role;
    usuarioDB.estate = estate;
    usuarioDB.name = name;
    usuarioDB.lastName = lastName;
    usuarioDB.email = newEmail;

    if (password) {
      password = await bcrypt.hash(password, 10).catch((errorCrypt) => {
        console.log(errorCrypt);
      });
      usuarioDB.password = password;
    }

    usuarioDB.save((errorGuardar, usuarioGuardado) => {
      if (errorGuardar) {
        return res.status(500).json({
          error: err,
          message: 'No se puede guardar el usuario',
        });
      }
      const usuarioFilter = _.pick(usuarioGuardado, ['role', 'estate', 'name', 'lastName', 'email']);
      return res.json({
        ok: true,
        usuario: usuarioFilter,
        message: 'Usuario actualizado',
      });
    });
  });
};

const deleteUsuario = async (req, res = response) => {
  const { email } = req.params;

  await Usuario.findOneAndDelete({ email }, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: 'No se ha podido eliminar el usuario',
      });
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        error: true,
        message: 'No se ha podido eliminar el usuario',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado',
    });
  });
};

module.exports = {
  getUsuarios,
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
};
