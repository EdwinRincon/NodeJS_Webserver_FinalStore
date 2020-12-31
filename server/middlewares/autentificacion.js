const jwt = require('jsonwebtoken');
// =========================
// Verificar Token
// =========================
let verificaToken = (req, res, next) => {
    let token = req.cookies.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: err,
                message: 'token invalido'
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

// =========================
// Verificar Admin Role
// =========================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        res.status(401).json({
            error: 'Error',
            message: 'El usuario no es administrador'
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}