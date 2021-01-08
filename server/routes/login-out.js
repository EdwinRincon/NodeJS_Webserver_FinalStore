const express = require('express');
const { verificaToken, verificaTokenResetPwd } = require("../middlewares/autentificacion");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
let Usuario = require('../models/Usuario');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                error: err,
                message: 'No se ha podido completar el login'
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        let usuarioFilter = _.pick(usuarioDB, ['name', 'email', 'role', 'img']);
        // Si hay un usuario encontrado y credenciales correctas
        let token = jwt.sign(
            {
                usuario: usuarioFilter,
            },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        res.cookie('token', token, {
            maxAge: 3600,
            httpOnly: false,
            secure: true,
            domain: 'ecommerce-final-d64fc.web.app'
        }).json({
            usuario: _.pick(usuarioFilter, 'email'),
            message: 'Sesión Iniciada'
        });
    });
});

app.post('/logout', verificaToken, (req, res) => {
    let token = req.cookies.token;
    if (token) {
        res.clearCookie('token').json({
            message: 'Sesión Cerrada'
        });
    }
});

// adminGuard Angular
app.get('/hasPermission', verificaToken, (req, res) => {
    res.status(200).json(true);
});


app.post('/resetPwd', verificaTokenResetPwd, (req, res) => {

    let password = req.body.password;
    let id = req.usuario._id;

    Usuario.findByIdAndUpdate(id, { password }, (err, usuarioActualizado) => {
        if (err) {
            return res.status(500).json({
                error: err,
                message: 'Password reset failed'
            });
        }
        if (!usuarioActualizado) {
            return res.status(500).json({
                error: err,
                message: 'Password reset failed'
            });
        }
        res.json({
            success: true,
            message: 'Password reset successful'
        });
    });
});

// correo si olvida la contraseña con un token
// verifica correo en la BBDD
app.post('/forgot', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: _.escape(body.email) }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                error: err,
                message: 'No se ha podido completar el login'
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        let usuarioFilter = _.pick(usuarioDB, ['_id']);
        // Si hay un usuario encontrado y credenciales correctas
        let token = jwt.sign(
            {
                usuario: usuarioFilter,
            },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        sendMailResetPwd(body.email, token, info => {
            if (info?.error) {
                res.status(500).json({
                    error: info.error,
                    message: info.message
                })
            }

            res.status(200).json({
                ok: true,
                message: 'Correo enviado correctamente'
            })
        });
    });
});


async function sendMailResetPwd(email, token, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PWDEMAIL
        }
    });

    let mailOptions = {
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "Reset Password Request", // Subject line
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            `https://ecommerce-final-d64fc.web.app/reset?token=${token}` +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return callback({
                error: 'Error al enviar el correo',
                message: 'Perdón algo ha salido mal'
            });
        }
    });

    callback(info);


}

module.exports = app;