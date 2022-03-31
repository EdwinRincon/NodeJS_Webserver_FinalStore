const _ = require('underscore');
const { response } = require('express');
const Orden = require('./ordenDAL');

const getOrdenes = async (req, res = response) => {
  let {
    ordenar = 'asc',
    search = '',
  } = req.query;

  ordenar = String(ordenar);
  search = String(search);

  const ORDENES = {
    $or: [
      { id_order: { $regex: _.escape(search), $options: 'i' } },
      { payer_id: { $regex: _.escape(search), $options: 'i' } },
      { create_time: { $regex: _.escape(search), $options: 'i' } },
    ],
  };

  Orden.find(ORDENES)
    .sort({ payer_id: ordenar })
    .exec((err, ordenesDB) => {
      if (err) {
        return res.status(500).json({
          error: err,
          message:
              'Ha habido un error, por favor comunicate en la zona de contacto',
        });
      }

      return res.json(ordenesDB);
    });
};

const postOrdenes = async (req, res = response) => {
  const BODY = req.body;

  const orden = new Orden({
    id_order: BODY.id_order,
    payer_id: BODY.payer_id,
    create_time: BODY.create_time,
  });

  orden.save((err, ordenDB) => {
    if (err) {
      return res.status(400).json({
        error: err,
        message: 'Error al guardar la orden',
      });
    }
    const ordenFilter = _.pick(ordenDB, ['id_order']);
    return res.status(201).json({
      success: true,
      id_order: ordenFilter,
    });
  });
};

const deleteOrdenes = async (req, res = response) => {
  const IDORDEN = req.params.idOrden;
  Orden.findOneAndDelete({ id_order: IDORDEN }, (err, ordenBorrado) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: 'No se ha podido eliminar la orden',
      });
    }
    if (!ordenBorrado) {
      return res.status(400).json({
        error: true,
        message: 'Esta orden no existe para borrar',
      });
    }

    return res.json({
      success: true,
      message: 'Orden eliminada',
    });
  });
};

module.exports = {
  postOrdenes,
  getOrdenes,
  deleteOrdenes,
};
