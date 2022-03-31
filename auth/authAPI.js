const { Router } = require('express');

const {
  login, logout, hasPermission, forgot, resetPwd,
} = require('./authController');
const { verificaTokenResetPwd } = require('../middlewares/autentificacion');

const router = Router();

/**
 * {{url}}/auth
 */
router.post('/login', login);
router.post('/logout', logout);
router.get('/hasPermission', hasPermission);
router.post('/resetPwd', verificaTokenResetPwd, resetPwd);
router.post('/forgot', forgot);

module.exports = router;
