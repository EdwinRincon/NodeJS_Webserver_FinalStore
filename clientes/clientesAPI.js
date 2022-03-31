const { Router } = require('express');
const {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autentificacion');

const {
  getClientes,
  getCliente,
  postCliente,
  putCliente,
  deleteCliente,
} = require('./clientesController');

const router = Router();

/**
 * {{url}}/clientes
 */
router.get('/', verificaToken, getClientes);
router.get('/:payer_id', verificaToken, getCliente);
router.post('/', postCliente);
router.put('/:payer_id', [verificaToken, verificaAdminRole], putCliente);
router.delete('/:payer_id', [verificaToken, verificaAdminRole], deleteCliente);

module.exports = router;
