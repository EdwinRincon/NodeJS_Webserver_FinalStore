const { Schema, model } = require('mongoose');

const OrdenProductoSchema = Schema({
  id_order: {
    type: String,
    ref: 'Orden',
    required: [true, 'El ID de la orden es necesario'],
  },
  payer_id: {
    type: String,
    ref: 'Cliente',
    required: [true, 'El ID del pagador es necesario'],
  },
  name: {
    type: String,
    ref: 'Producto',
    required: [true, 'El nombre producto es necesario'],
  },
  cantidad: {
    type: Number,
    required: [true, 'Cantidad de productos comprados es necesario'],
  },

});


