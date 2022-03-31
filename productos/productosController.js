const _ = require('underscore');
const { response } = require('express');
const Producto = require('./productoDAL');

const getProductos = async (req, res = response) => {
  let {
    skip = 0,
    ordenar = 'asc',
    search = '',
    page = 0,
  } = req.query;
  const { category = 'undefined' } = req.query;

  skip = Number(skip);
  ordenar = String(ordenar);
  search = String(search);
  page = Number(page);

  let productos;
  if (category !== 'undefined' && category.length !== 0) {
    productos = {
      $or: [
        {
          $and: [
            { name: { $regex: _.escape(search), $options: 'i' } },
            { category },
          ],
        },
        {
          $and: [
            { description: { $regex: _.escape(search), $options: 'i' } },
            { category },
          ],
        },
      ],
    };
  } else {
    productos = {
      $or: [
        {
          name: { $regex: _.escape(search), $options: 'i' },
        },
        {
          description: { $regex: _.escape(search), $options: 'i' },
        },
      ],
    };
  }

  Producto.find(productos)
    .sort({ price: ordenar })
    .skip(skip * page)
    .exec(async (err, productosDB) => {
      if (err) {
        return res.status(500).json({
          error: err,
          message:
            'Ha habido un error, por favor comunicate en la zona de contacto',
        });
      }
      const productosFilter = productosDB.map((p) => _.pick(p, [
        'available',
        'name',
        'price',
        'description',
        'category',
        'image',
      ]));

      return res.status(200).json(productosFilter);
    });
};

const getProducto = (req, res = response) => {
  const NAME = _.escape(req.params.name);

  Producto.findOne({ name: NAME }, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Este producto no existe',
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        error: true,
        message: 'Este producto no existe',
      });
    }

    const productoFilter = _.pick(productoDB, [
      'available',
      'name',
      'price',
      'description',
      'category',
      'image',
    ]);
    return res.json(productoFilter);
  });
};

const postProducto = (req, res = response) => {
  const BODY = req.body;

  const producto = new Producto({
    name: BODY.name,
    price: BODY.price,
    image: BODY.image,
    description: BODY.description,
    category: BODY.category,
    available: BODY.available,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(400).json({
        error: err,
        message: 'Error al guardar el producto',
      });
    }
    const productoFilter = _.pick(productoDB, [
      'available',
      'name',
      'price',
      'image',
      'description',
      'category',
    ]);
    return res.status(201).json({
      success: true,
      producto: productoFilter,
      message: 'Producto agregado correctamente',
    });
  });
};

const putProducto = (req, res = response) => {
  const NAME = _.escape(req.params?.name);
  const {
    name, price, image, description, category, available,
  } = req.body;

  Producto.findOne({ name: NAME }, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Este producto no existe',
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        error: true,
        message: 'Este producto no existe',
      });
    }

    productoDB.name = name;
    productoDB.price = price;
    productoDB.image = image;
    productoDB.description = description;
    productoDB.category = category;
    productoDB.available = available;

    return productoDB.save((error, productoGuardado) => {
      if (error) {
        return res.status(500).json({
          error,
          message: 'No se puede guardar el producto',
        });
      }
      const productoFilter = _.pick(productoGuardado, [
        'available',
        'name',
        'price',
        'description',
        'image',
        'category',
      ]);
      return res.json({
        ok: true,
        producto: productoFilter,
        message: 'Producto actualizado',
      });
    });
  });
};

const deleteProducto = (req, res = response) => {
  const NAME = req.params.name;

  Producto.findOneAndDelete({ name: NAME }, (err, productoBorrado) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: 'No se ha podido eliminar el producto',
      });
    }
    if (!productoBorrado) {
      return res.status(400).json({
        error: true,
        message: 'Este producto no existe para borrar',
      });
    }

    return res.json({
      success: true,
      message: 'Producto eliminado',
    });
  });
};

module.exports = {
  getProductos,
  getProducto,
  postProducto,
  putProducto,
  deleteProducto,
};
