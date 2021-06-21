const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido',
};

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es necesario'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos,
  },
  estate: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function eliminarPwd() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = model('Usuario', UserSchema);
