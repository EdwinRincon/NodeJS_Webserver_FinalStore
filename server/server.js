require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

// cors-enabled
app.use(cors({ credentials: true, origin: 'https://ecommerce-final-d64fc.web.app'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// cookie log/logout user
app.use(cookieParser());

// Configuracion global de rutas
app.use(require('./routes/index'));

const uri = process.env.URLDB;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },(err) => {
    if ( err ) throw err;
    console.log('base de datos ONLINE', uri);
  }); 

app.listen(process.env.PORT, () => {
  console.log(`API REST listening at http://localhost:${process.env.PORT}`)
});
