require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const app = express()

// cors-enabled
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
// cookie log/logout user
app.use(cookieParser());
// Configuracion global de rutas
app.use(require('./routes/index'));

app.use(express.static(path.join(__dirname, 'public')));

const uri = process.env.URLDB;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },(err) => {
    if ( err ) throw new Error(err);
    console.log('base de datos ONLINE');
  }); 

app.listen(process.env.PORT, () => {
  console.log(`API REST listening at http://localhost:${process.env.PORT}`)
});
