const express = require('express');
const app = express();

app.use(require('./login-out'));
app.use(require('./producto'));
app.use(require('./usuario'));
app.use(require('./send-email'));

module.exports = app;