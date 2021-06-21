const jwt = require('jsonwebtoken');
// =========================
// Verificar Token
// =========================
const verificaToken = (req, res, next) => {
  const token = req.cookies?.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: err,
        message: 'token invalido',
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};
// =========================
// Verificar Token RESET PASSWORD
// =========================
const verificaTokenResetPwd = (req, res, next) => {
  const { token } = req.query;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: err,
        message: 'token invalido',
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

// =========================
// Verificar Admin Role
// =========================
const verificaAdminRole = (req, res, next) => {
  const { usuario } = req?.role;

  if (usuario === 'ADMIN_ROLE') {
    next();
  } else {
    res.status(401).json({
      error: 'Error',
      message: 'El usuario no es administrador',
    });
  }
};

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenResetPwd,
};
