const { response } = require('express');
const _ = require('underscore');
const Cliente = require('./clienteDAL');

const getClientes = async (req, res = response) => {
  let {
    ordenar = 'asc',
    search = '',
  } = req.query;

  ordenar = String(ordenar);
  search = String(search);

  const CLIENTES = {
    $or: [
      { payer_id: { $regex: _.escape(search), $options: 'i' } },
      { given_name: { $regex: _.escape(search), $options: 'i' } },
      { surname: { $regex: _.escape(search), $options: 'i' } },
      { email_address: { $regex: _.escape(search), $options: 'i' } },
      { address_line: { $regex: _.escape(search), $options: 'i' } },
      { postal_code: { $regex: _.escape(search), $options: 'i' } },
      { city: { $regex: _.escape(search), $options: 'i' } },
    ],
  };

  Cliente.find(CLIENTES)
    .sort({ given_name: ordenar })
    .exec((err, clientesDB) => {
      if (err) {
        return res.status(500).json({
          error: err,
          message:
            'Ha habido un error, por favor comunicate en la zona de contacto',
        });
      }

      return res.json(clientesDB);
    });
};

const getCliente = async (req, res = response) => {
  const PAYER_ID = req.params.payer_id;

  await Cliente.findOne({ payer_id: PAYER_ID }, (err, clienteDB) => {
    if (clienteDB === null) {
      return res.status(400).json({
        error: err,
        message: 'Credenciales erroneas',
      });
    }

    return res.json(clienteDB);
  });
};

const postCliente = async (req, res = response) => {
  const {
    payer_id, given_name, surname, email_address, address_line, postal_code, city,
  } = req.body;

  const update = {
    payer_id, given_name, surname, email_address, address_line, postal_code, city,
  };

  await Cliente.findOneAndUpdate({ payer_id }, update, {
    new: true,
    upsert: true, // Make this update into an upsert
  }, (err, clienteDB) => {
    if (err) {
      return res.status(400).json({
        error: err.message.split(','),
        message: 'No se puede guardar el cliente',
      });
    }
    if (clienteDB) {
      const clienteFilter = _.pick(clienteDB, ['given_name', 'surname', 'email_address']);
      return res.status(200).json({
        ok: true,
        cliente: clienteFilter,
      });
    }
  });
};

const putCliente = (req, res = response) => {
  const PAYER_ID = _.escape(req.params?.payer_id);
  const {
    given_name, surname, email_address, address_line, postal_code, city,
  } = req.body;

  Cliente.findOne({ payer_id: PAYER_ID }, (err, clienteDB) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Este cliente no existe',
      });
    }

    if (!clienteDB) {
      return res.status(400).json({
        error: true,
        message: 'Este cliente no existe',
      });
    }

    clienteDB.given_name = given_name;
    clienteDB.surname = surname;
    clienteDB.email_address = email_address;
    clienteDB.address_line = address_line;
    clienteDB.postal_code = postal_code;
    clienteDB.city = city;

    return clienteDB.save((error, clienteGuardado) => {
      if (error) {
        return res.status(500).json({
          error: err.message.split(','),
          message: 'No se puede guardar el cliente',
        });
      }

      return res.json({
        ok: true,
        cliente: clienteGuardado,
      });
    });
  });
};

const deleteCliente = (req, res = response) => {
  const PAYER_ID = _.escape(req.params?.payer_id);

  Cliente.findOneAndDelete({ payer_id: PAYER_ID }, (err, clienteBorrado) => {
    if (err) {
      return res.status(500).json({
        error: err,
        message: 'No se ha podido eliminar el cliente',
      });
    }
    if (!clienteBorrado) {
      return res.status(400).json({
        error: true,
        message: 'Este cliente no existe para borrar',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cliente eliminado',
    });
  });
};

module.exports = {
  getClientes,
  getCliente,
  postCliente,
  putCliente,
  deleteCliente,
};
