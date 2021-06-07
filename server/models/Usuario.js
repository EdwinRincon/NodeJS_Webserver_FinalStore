const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true,'El nombre es necesario']
    },
    last_name: {
        type: String,
        required: [true,'El apellido es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    image: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estate: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

// npm i mongoose-unique-validator
userSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser único'});
module.exports = mongoose.model('Usuario', userSchema);