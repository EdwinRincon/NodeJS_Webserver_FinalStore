const express = require('express');
const bcrypt = require('bcrypt');
let Usuario = require('../models/Usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentificacion');
const _ = require('underscore');
const app = express();


app.get('/usuarios', [verificaToken, verificaAdmin_Role], async (req, res) => {

  let desde = req.query.desde ?? 0;
  desde = Number(desde);

  let limite = req.query.limite ?? 5;
  limite = Number(limite);

  let ordenar = req.query.ordenar ?? 'asc';
  ordenar = String(ordenar);

  let search = req.query.search ?? '';
  search = String(search);

  findObject = {
    $or: [
    {name: { $regex: _.escape(search), $options: 'i' }},
    {last_name: { $regex: _.escape(search), $options: 'i' }},
    {email: { $regex: _.escape(search), $options: 'i' }}
  ]
  }
  await Usuario.find({})
    .sort({ name: ordenar })
    .skip(desde)
    .limit(limite)
    .exec((err, usuariosDB) => {

      if (err) {
        return res.status(500).json({
          error: err,
          message: 'Ha habido un error, por favor comunicate en la zona de contacto'
        });
      }
    usuariosFilter =  usuariosDB.map(usr => _.pick(usr, ['role','name','last_name','email']));

      res.json({
        usuarios: usuariosFilter
      });
    })
});

app.get('/usuario/:email', [verificaToken,verificaAdmin_Role],async (req, res) => {
  let email = req.params.email;
  
 await Usuario.findOne({email}, (err, usuarioDB) => {
    if (usuarioDB === null) {
      return res.status(400).json({
        error: err,
        message: 'Credenciales erroneas'
      });
    }
    let usuarioFilter = _.pick(usuarioDB, ['role','name','last_name','email']);
    res.json({
      success: true,
      usuario: usuarioFilter
    });
  });
});

app.post('/usuario', [verificaToken,verificaAdmin_Role], (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    name: body.name,
    last_name: body.last_name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        error: err,
        message: 'No se puede guardar el usuario'
      });
    }

    let usuarioFilter = _.pick(usuarioDB, ['role','name','last_name','email']);

    res.json({
      ok: true,
      usuario: usuarioFilter
    });
  });
});

app.put('/usuario/:email', [verificaToken, verificaAdmin_Role], async (req, res) => {
  let email = _.escape(req.params.email);
  let body = _.pick(req.body, ['role', 'estate','name','last_name', 'email','password']);

  Usuario.findOne({ email }, (err, usuarioDB) => {
      if (err) {
          return res.status(500).json({
              error: true,
              message: 'No se pudó actualizar el usuario'
          });
      }

      if (!usuarioDB) {
          return res.status(400).json({
              error: true,
              message: 'No se pudó actualizar el usuario'
          });
      }

      usuarioDB.role = body.role;
      usuarioDB.estate = body.estate;
      usuarioDB.name = body.name;
      usuarioDB.last_name = body.last_name;
      usuarioDB.email = body.email;
      usuarioDB.password = bcrypt.hashSync(body.password, 10);

      usuarioDB.save((err, usuarioGuardado) => {
          if (err) {
              return res.status(500).json({
                  error: err,
                  message: 'No se puede guardar el usuario'
              });
          }
          let usuarioFilter = _.pick(usuarioGuardado, ['role', 'estate', 'name', 'last_name', 'email']);
          res.json({
              ok: true,
              usuario: usuarioFilter,
              message: 'Usuario actualizado'
          });
      });
  });

});

app.delete('/usuario/:email', [verificaToken, verificaAdmin_Role], (req, res) => {
  let email = req.params.email;

  Usuario.findOneAndDelete({ email }, (err, usuarioBorrado) => {
      if (err) {
          return res.status(500).json({
              error: err,
              message: "No se ha podido eliminar el usuario"
          });
      }
      if (!usuarioBorrado) {
          return res.status(400).json({
              error: true,
              message: "No se ha podido eliminar el usuario"
          });
      }

      res.json({
          success: true,
          message: 'Usuario eliminado'
      });

  });
});

module.exports = app;