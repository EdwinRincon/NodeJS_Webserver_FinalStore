const express = require('express');
const bcrypt = require('bcrypt');
let Usuario = require('../models/Usuario');
const { verificaToken } = require('../middlewares/autentificacion');
const app = express();


app.get('/usuario/:id', verificaToken, (req, res) => {
  let body = req.body;
  let id = req.params.id;

  Usuario.findById(id, body, (err, usuarioDB) => {
    if (usuarioDB === null) {
      return res.status(400).json({
        error: err,
        message: 'Credenciales erroneas'
      });
    }
    res.json({
      success: true,
      usuario: usuarioDB
    });
  })
})

app.post('/usuario', verificaToken, (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});



module.exports = app;