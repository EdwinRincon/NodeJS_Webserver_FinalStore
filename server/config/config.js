process.env.PORT = process.env.PORT || 3000;


// =========================
// VENCIMIENTO DEL TOKEN
// =========================
// expiresIn: 60 * 60 * 24 * 30 
process.env.CADUCIDAD_TOKEN = '8H';

// =========================
// SEED DE AUTH
// =========================
process.env.SEED = process.env.SEED || 'seed-desarrollo';


// =========================
// Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// =========================
// Base de Datos
// =========================
let urlDB;

if (process.env.NODE_ENV === 'development') {
    urlDB = 'mongodb://localhost:27017/finalStore';
}else{
   urlDB = process.env.URLDB;
}

process.env.URLDB = urlDB;
