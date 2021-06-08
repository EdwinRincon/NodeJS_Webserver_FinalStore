const Usuario = require("../models/Usuario.js");
const { response } = require("express");
const _ = require("underscore");
const bcrypt = require("bcrypt");

const getUsuarios = (req, res = response) => {
  let { desde = 0, limite = 5, ordenar = "asc", search = "" } = req.query;

  desde = Number(desde);
  limite = Number(limite);
  ordenar = String(ordenar);
  search = String(search);

  usuarios = {
    $or: [
      { name: { $regex: _.escape(search), $options: "i" } },
      { last_name: { $regex: _.escape(search), $options: "i" } },
      { email: { $regex: _.escape(search), $options: "i" } },
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
            "Ha habido un error, por favor comunicate en la zona de contacto",
        });
      }
      usuariosFilter = usuariosDB.map((usr) =>
        _.pick(usr, ["role", "name", "last_name", "email"])
      );

      res.json({
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
        message: "Credenciales erroneas",
      });
    }
    let usuarioFilter = _.pick(usuarioDB, [
      "role",
      "name",
      "last_name",
      "email",
    ]);
    res.json({
      success: true,
      usuario: usuarioFilter,
    });
  });
};

const postUsuario = async (req, res = response) => {
  let { name, last_name, email, password, role } = req.body;

  await Usuario.findOne({ email }, (err, usuarioDB) => {
    if (usuarioDB) {
      return res.status(400).json({
        error: `${req.body.email}, está en uso. Intenta iniciar sesión o utiliza otro correo para crear la cuenta`,
      });
    }
  });

  password = await bcrypt.hash(password, 10).catch(err => {console.log(err);})
  let usuario = new Usuario({ name, last_name, email, password, role });


  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        message: "No se puede guardar el usuario",
        error: err.message,
      });
    }

    let usuarioFilter = _.pick(usuarioDB, ["role", "name", "last_name", "email"]);

    res.json({
      ok: true,
      usuario: usuarioFilter,
    });
  });
};

const putUsuario = (req, res = response) => {
  let old_email = req.params.email;
  let { role, estate, name, last_name, email: new_email, password } = req.body;

  Usuario.findOne({ email: old_email }, async (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: "No se pudó actualizar el usuario",
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        error: true,
        message: "No se pudó actualizar el usuario",
      });
    }

    usuarioDB.role = role;
    usuarioDB.estate = estate;
    usuarioDB.name = name;
    usuarioDB.last_name = last_name;
    usuarioDB.email = new_email;
    if (password) {
      password = await bcrypt.hash(password, 10).catch(err => {console.log(err);})
      usuarioDB.password = password;
    }


    usuarioDB.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          error: err,
          message: "No se puede guardar el usuario",
        });
      }
      let usuarioFilter = _.pick(usuarioGuardado, ["role", "estate", "name", "last_name", "email"]);
      res.json({
        ok: true,
        usuario: usuarioFilter,
        message: "Usuario actualizado",
      });
    });
  });
};

const deleteUsuario = async (req, res = response) => {
  let email = req.params.email;

  await Usuario.findOneAndDelete({ email }, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "No se ha podido eliminar el usuario",
      });
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        error: true,
        message: "No se ha podido eliminar el usuario",
      });
    }

    res.json({
      success: true,
      message: "Usuario eliminado",
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
