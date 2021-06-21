const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ClienteSchema = Schema({
  payer_id: {
    type: String,
    unique: true,
    required: [true, 'El ID del pagador es necesario'],
  },
  given_name: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  surname: {
    type: String,
    required: [true, 'El apellido es necesario'],
  },
  email_address: {
    type: String,
    required: [true, 'El correo es necesario'],
  },
  address_line: {
    type: String,
    required: [true, 'El domicilio es necesario'],
  },
  postal_code: {
    type: String,
  },
  city: {
    type: String,
  },
});

ClienteSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = model('Cliente', ClienteSchema);
