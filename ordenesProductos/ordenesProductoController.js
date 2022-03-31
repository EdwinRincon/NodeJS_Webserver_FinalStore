const _ = require('underscore');
const { response } = require('express');
const OrdenesProducto = require('./ordenProductoDAL');

const getOrdenesProducto = async (req, res = response) => {
  let {
    ordenar = 'asc',
    search = '',
  } = req.query;

  ordenar = String(ordenar);
  search = String(search);

  const ORDENESPRODUCTO = {
    $or: [
      { id_order: { $regex: _.escape(search), $options: 'i' } },
      { payer_id: { $regex: _.escape(search), $options: 'i' } },
      { name: { $regex: _.escape(search), $options: 'i' } },
    ],
  };

  OrdenesProducto.find(ORDENESPRODUCTO)
    .sort({ idOrder: ordenar })
    .exec((err, ordenesProductoDB) => {
      if (err) {
        return res.status(500).json({
          error: err,
          message:
                'Ha habido un error, por favor comunicate en la zona de contacto',
        });
      }

      return res.json(ordenesProductoDB);
    });
};

const getOrdenProducto = async (req, res = response) => {
  const { idOrden, name } = req.params;

  OrdenesProducto.findOne({ idOrden, name }, (err, ordenProductoDB) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Esta orden y producto no existe',
      });
    }
    if (!ordenProductoDB) {
      return res.status(400).json({
        error: true,
        message: 'Esta orden y producto no existe',
      });
    }

    const ordenProductoFilter = _.pick(ordenProductoDB, [
      'id_order',
      'payer_id',
      'name',
      'cantidad',
    ]);
    return res.json(ordenProductoFilter);
  });
};

const postOrdenesProducto = async (req, res = response) => {
  const BODY = req.body;

  const ordeneProducto = new OrdenesProducto({
    name: BODY.name,
    id_order: BODY.id_order,
    payer_id: BODY.payer_id,
    cantidad: BODY.cantidad,
  });

  ordeneProducto.save((err, ordenProductoDB) => {
    if (err) {
      return res.status(400).json({
        error: err,
        message: 'Error al guardar los productos de la orden',
      });
    }
    const ordenProductoFilter = _.pick(ordenProductoDB, ['name']);
    return res.status(201).json({
      success: true,
      name: ordenProductoFilter,
    });
  });
};

const putOrdenProducto = async (req, res = response) => {
  const { idOrder, name: nameParam } = req.params;
  const {
    name: nameBody, id_order, payer_id, cantidad,
  } = req.body;

  OrdenesProducto.findOne({ id_order: idOrder, name: nameParam }, (err, ordenProductoDB) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Esta orden o producto no existe',
      });
    }

    if (!ordenProductoDB) {
      return res.status(400).json({
        error: true,
        message: 'Esta orden o producto no existe',
      });
    }

    ordenProductoDB.name = nameBody;
    ordenProductoDB.id_order = id_order;
    ordenProductoDB.payer_id = payer_id;
    ordenProductoDB.cantidad = cantidad;

    return ordenProductoDB.save((error, ordenProductoGuardado) => {
      if (error) {
        return res.status(500).json({
          error,
          message: 'No se puede guardar la orden con su producto',
        });
      }
      const ordenProductoFilter = _.pick(ordenProductoGuardado, [
        'name',
        'cantidad',
      ]);
      return res.json({
        ok: true,
        producto: ordenProductoFilter,
        message: 'Orden y producto actualizado',
      });
    });
  });
};

const deleteOrdenProducto = async (req, res = response) => {
  const { idOrden, name } = req.params;

  OrdenesProducto.findOneAndDelete({ idOrden, name }, (err, ordenProductoBorrado) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: 'No se ha podido eliminar la orden',
      });
    }
    if (!ordenProductoBorrado) {
      return res.status(400).json({
        error: true,
        message: 'Esta orden no existe para borrar',
      });
    }

    return res.json({
      success: true,
      message: 'Orden con su producto eliminado',
    });
  });
};

module.exports = {
  postOrdenesProducto,
  getOrdenesProducto,
  getOrdenProducto,
  putOrdenProducto,
  deleteOrdenProducto,
};
