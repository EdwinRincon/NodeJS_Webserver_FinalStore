var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var ordenProductoSchema = new Schema({
    id_order:{
        type: Schema.Types.ObjectId,
        ref: 'Orden',
        required: [true, 'El ID de la orden es necesario']
    },
    payer_id:{
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El ID del pagador es necesario']
    },
    id_Producto:{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'La fecha de compra es necesaria']
    },

});

ordenProductoSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser único'});
module.exports = mongoose.model('OrdenProducto', ordenProductoSchema);