const express = require('express');
const app = express();

app.use(require('./login-out.js'));
app.use(require('./producto.js'));
app.use(require('./usuario.js'));
app.use(require('./send-email.js'));

module.exports = app;