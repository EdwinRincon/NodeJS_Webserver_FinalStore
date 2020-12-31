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
        
        req.user = decoded.user;
        next();
    });

};

module.exports = {
    verificaToken
}