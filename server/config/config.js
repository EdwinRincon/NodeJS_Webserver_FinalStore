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
