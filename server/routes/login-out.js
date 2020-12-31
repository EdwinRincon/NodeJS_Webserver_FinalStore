const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                error: err,
                message: 'No se ha podido completar el login'
            })
        }
        if(!usuarioDB){
            return res.status(500).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(500).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        // Si hay un usuario encontrado y credenciales correctas
        let token = jwt.sign(
            {
                usuario: usuarioDB,
            },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        res.cookie('token', token, {maxAge: 28800000, httpOnly: true}).json({
            message: 'Sesión Iniciada'
        });
    });
});

app.post('/logout', (req, res) => {
    let token = req.cookies.token;
    if (token) {
        res.clearCookie('token').json({ 
            message: 'Sesión Cerrada'
        });
    }
});

module.exports = app;