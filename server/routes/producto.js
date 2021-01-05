const express = require('express');
const { verificaToken, verificaAdmin_Role } = require("../middlewares/autentificacion");
let Producto = require('../models/Producto');
const _ = require('underscore');
const app = express();


// retorna todos los productos available = true
app.get('/productos', async (req, res) => {

    let desde = req.query.desde ?? 0;
    desde = Number(desde);

    let limite = req.query.limite ?? 5;
    limite = Number(limite);

    let ordenar = req.query.ordenar ?? 'asc';
    ordenar = String(ordenar);

    let search = req.query.search ?? '';
    search = String(search);

    let category = req.query.category;


    if (category !== undefined) {
        var findObject = {
            $or: [
                {
                    $and: [
                        { name: { $regex: _.escape(search), $options: 'i' } },
                        { category: category }
                    ]
                },
                {
                    $and: [
                        { description: { $regex: _.escape(search), $options: 'i' } },
                        { category: category }
                    ]
                }
            ]
        };
    } else {
        var findObject = {
            $or: [{
                name: { $regex: _.escape(search), $options: 'i' }
            }, {
                description: { $regex: _.escape(search), $options: 'i' }
            }]
        };
    }

    await Producto.find(findObject)
        .sort({ price: ordenar })
        .skip(desde)
        .limit(limite)
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                    message: 'Ha habido un error, por favor comunicate en la zona de contacto'
                });
            }
            let productosFilter = productosDB.map(p => _.pick(p, ['available', 'name', 'price', 'description', 'category']));
            res.json({
                productos: productosFilter
            });
        })
});

// retorna un producto por su nombre
app.get("/producto/:name", (req, res) => {
    let name = _.escape(req.params.name);

    Producto.findOne({ name }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: 'Este producto no existe'
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                error: true,
                message: 'Este producto no existe'
            });
        }

        let productoFilter = _.pick(productoDB, ['available', 'name', 'price', 'img', 'description', 'category']);
        res.json({
            success: true,
            producto: productoFilter
        });
    });
});

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        name: body.name,
        price: body.price,
        img: body.img,
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
        let productoFilter = _.pick(productoDB, ['available', 'name', 'price', 'img', 'description', 'category']);
        res.status(201).json({
            success: true,
            producto: productoFilter,
            message: 'Producto agregado correctamente'
        });
    });
});

app.put('/producto/:name', verificaToken, (req, res) => {
    let name = _.escape(req.params.name);
    let body = _.pick(req.body, ['name', 'price', 'img', 'description', 'category', 'available']);

    Producto.findOne({ name }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: 'Este producto no existe'
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                error: true,
                message: 'Este producto no existe'
            });
        }

        productoDB.name = body.name;
        productoDB.price = body.price;
        productoDB.img = body.img;
        productoDB.description = body.description;
        productoDB.category = body.category;
        productoDB.available = body.available;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                    message: 'No se puede guardar el producto'
                });
            }
            let productoFilter = _.pick(productoGuardado, ['available', 'name', 'price', 'description', 'category']);
            res.json({
                ok: true,
                producto: productoFilter,
                message: 'Producto actualizado'
            });
        });
    });


});

// Eliminar un producto
app.delete('/producto/:name', [verificaToken, verificaAdmin_Role], (req, res) => {
    let name = req.params.name;

    Producto.findOneAndDelete({ name }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                error: err,
                message: "No se ha podido eliminar el producto"
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                error: true,
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