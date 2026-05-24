const { Schema, model } = require('mongoose');

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
    unique: true,
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

ClienteSchema.methods.toJSON = function eliminarIDsV() {
  const cliente = this;
  const clienteObject = cliente.toObject();
  delete clienteObject._id;
  delete clienteObject.__v;
  return clienteObject;
};

module.exports = model('Cliente', ClienteSchema);
