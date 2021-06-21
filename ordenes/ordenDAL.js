const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const OrdenSchema = Schema({
  id_order: {
    type: String,
    unique: true,
    required: [true, 'El ID de la orden es necesario'],
  },
  payer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'El ID del pagador es necesario'],
  },
  create_time: {
    type: String,
    required: [true, 'La fecha de compra es necesaria'],
  },
});

OrdenSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = model('Orden', OrdenSchema);
