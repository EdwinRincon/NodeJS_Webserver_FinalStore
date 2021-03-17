var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let categories = {
    values: ['auriculares', 'moviles', 'ordenadores', 'relojes', 'televisores'],
    message: '{VALUE} no es una categoría válida'
}

var productoSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    price: {
        type: Number,
        required: [true, 'El precio es necesario']
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: categories,
        required: true
    },
    available: { 
        type: Boolean, 
        required: true, 
        default: true 
    }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Producto', productoSchema);