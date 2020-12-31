var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var clienteSchema = new Schema({
    payer_id:{
        type: String,
        unique: true,
        required: [true, 'El ID del pagador es necesario']
    },
    given_name:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    surname:{
        type: String,
        required: [true, 'El apellido es necesario']
    },
    email_address: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    address_line: {
        type: String,
        required: [true, 'El domicilio es necesario']
    },
    postal_code: {
        type: String
    },
    city: {
        type: String
    }
});

clienteSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser único'});
module.exports = mongoose.model('Cliente', clienteSchema);