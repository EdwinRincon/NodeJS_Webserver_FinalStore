const { Router } = require('express');
const {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autentificacion');

const { postOrdenes, getOrdenes, deleteOrdenes } = require('./ordenesController');

const router = Router();

/**
 * {{url}}/ordenes
 */

router.get('/', verificaToken, getOrdenes);
router.post('/', postOrdenes);
router.delete('/:idOrden', [verificaToken, verificaAdminRole], deleteOrdenes);
module.exports = router;
