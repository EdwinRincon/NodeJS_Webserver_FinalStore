const { Router } = require('express');
const {
  verificaToken, verificaAdminRole,
} = require('../middlewares/autentificacion');

const router = Router();

const {
  postOrdenesProducto,
  getOrdenesProducto,
  getOrdenProducto,
  putOrdenProducto,
  deleteOrdenProducto,
} = require('./ordenesProductoController');
/**
 * {{url}}/ordenesProductos
 */
router.get('/', verificaToken, getOrdenesProducto);
router.get('/:idOrder/:name', verificaToken, getOrdenProducto);
router.post('/', postOrdenesProducto);
router.put('/:idOrder/:name', [verificaToken, verificaAdminRole], putOrdenProducto);
router.delete('/:idOrder/:name', [verificaToken, verificaAdminRole], deleteOrdenProducto);

module.exports = router;
