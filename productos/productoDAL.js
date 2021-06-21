const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const categories = {
  values: ['auriculares', 'moviles', 'ordenadores', 'relojes', 'televisores'],
  message: '{VALUE} no es una categoría válida',
};

const ProductoSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'El nombre es necesario'],
  },
  price: {
    type: Number,
    required: [true, 'El precio es necesario'],
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: categories,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
});

ProductoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = model('Producto', ProductoSchema);
