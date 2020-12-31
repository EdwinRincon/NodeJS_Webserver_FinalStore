const express = require('express');
let app = express();
let Producto = require('../models/Producto');
const { verificaToken } = require("../middlewares/autentificacion");

app.get('/productos', (req, res) =>{
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({available: true})
    .skip(desde)
    .limit
    .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
               error: err,
               message: 'Ha habido un error, por favor comunicate en la zona de contacto' 
            });
        }
        res.json({
            productos
        });
    })
});

app.post('/producto', verificaToken, (req, res) =>{
    let body = req.body;

    let producto = new Producto({
        user: req.user._id,
        id_Producto: body.id_Producto,
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        available: body.available
    });

    producto.save((err, productoDB) =>{
        if (err) {
            return res.status(500).json({
                error: err,
                message: 'Error al guardar el producto'
            });
        }

        res.status(201).json({
            success: true,
            productoDB,
            message: 'Producto agregado correctamente'
        });
    });
});

module.exports = app;