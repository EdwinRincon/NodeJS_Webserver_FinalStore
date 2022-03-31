const { Router } = require('express');
const {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autentificacion');

const {
  getProductos,
  getProducto,
  postProducto,
  putProducto,
  deleteProducto,
} = require('./productosController');

const router = Router();

/**
 * {{url}}/productos
 *
 */
router.get('/', getProductos); // Obtener todos los productos
router.get('/:name', getProducto); // Obtener 1 producto
router.post('/', verificaToken, postProducto); // Crear producto
router.put('/:name', [verificaToken, verificaAdminRole], putProducto); // Actualizar producto
router.delete('/:name', [verificaToken, verificaAdminRole], deleteProducto); // Eliminar producto definitivamente de la BBDD (putProducto AVAILABLE: false. para no eliminarlo pero cambiar su estado)
module.exports = router;
