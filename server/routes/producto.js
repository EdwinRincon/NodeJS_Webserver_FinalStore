const express = require('express');
const { verificaToken, verificaAdmin_Role } = require("../middlewares/autentificacion");
let Producto = require('../models/Producto');
const _ = require('underscore');
let app = express();

// retorna todos los productos
app.get('/productos', (req, res) => {
    let desde = req.query.desde ?? 0;
    desde = Number(desde);

    Producto.find({ available: true })
        .skip(desde)
        .limit(5)
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

app.get("/producto/:id", (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: 'ID no existe'
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    error: err,
                    message: 'ID no existe'
                });
            }

            res.json({
                success: true,
                producto: productoDB
            });

        });
});

// CREA un producto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        user: req.usuario._id,
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        available: body.available
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                error: err,
                message: 'Error al guardar el producto'
            });
        }
        let productoFilter = _.pick(productoDB,['available','name','price','description','category']);
        res.status(201).json({
            success: true,
            producto: productoFilter,
            message: 'Producto agregado correctamente'
        });
    });
});

// Eliminar un producto
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndDelete(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                error: err,
                message: "No se ha podido eliminar el producto"
            });
        }
        if (!productoBorrado) {
            return res.status(500).json({
                error: err,
                message: "Este producto no existe para borrar"
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado'
        });

    });

});










module.exports = app;