const { Router } = require('express');

const { sendEmail } = require('./emailController');

const router = Router();
/**
 * {{url}}/email
 *
 */
router.post('/', sendEmail); // Enviar email a la tienda

module.exports = router;
