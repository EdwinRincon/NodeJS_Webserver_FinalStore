var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let categories = {
    values: ['auriculares', 'moviles', 'ordenadores', 'relojes', 'televisores'],
    message: '{VALUE} no es una categoría válida'
}

var productoSchema = new Schema({
    id_Producto: {
        type: String,
        unique: true,
        required: [true, 'EL ID del producto es necesario']
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    price: {
        type: Number,
        required: [true, 'El precio es necesario']
    },
    img: {
        type: String,
        required: false
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: categories
    },
    available: { 
        type: Boolean, 
        required: true, 
        default: true 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Producto', productoSchema);