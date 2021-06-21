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
  getTotalProductos,
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
router.delete('/:name', [verificaToken, verificaAdminRole], deleteProducto); // Eliminar producto definitivamente de la BBDD (putProducto AVAILABLE: false. para no elimiarno pero cambiar su estado)
router.get('/total/n', getTotalProductos); // Numero total de productos (AVAILABLE: true & false)

module.exports = router;
