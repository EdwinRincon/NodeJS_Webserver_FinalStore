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

let urlDB;

//if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/finalStore';
//}else{
//    urlDB = "mongodb+srv://admin-user:MsMVFdCPjOyRVIkj@realmcluster.wognb.mongodb.net/finalStore?retryWrites=true&w=majority";
//}

process.env.URLDB = urlDB;