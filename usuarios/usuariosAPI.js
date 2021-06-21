const { Router } = require('express');
const {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autentificacion');

const {
  getUsuarios,
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
} = require('./usuariosController');

const router = Router();

/**
 * {{url}}/usuarios
 */
router.get('/', [verificaToken, verificaAdminRole], getUsuarios); // Obtener todos los usuarios
router.get('/:email', [verificaToken, verificaAdminRole], getUsuario); // Obtener 1 usuario
router.post('/', [verificaToken, verificaAdminRole], postUsuario); // Crear nuevo usuario
router.put('/:email', [verificaToken, verificaAdminRole], putUsuario); // Actualizar usuario
router.delete('/:email', [verificaToken, verificaAdminRole], deleteUsuario); // Eliminar usuario

module.exports = router;
