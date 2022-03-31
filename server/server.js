const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { dbConnection } = require('../database/databaseConfig');
const authAPI = require('../auth/authAPI');
const productosAPI = require('../productos/productosAPI');
const usuariosAPI = require('../usuarios/usuariosAPI');
const clientesAPI = require('../clientes/clientesAPI');
const emailAPI = require('../email/emailAPI');
const ordenesAPI = require('../ordenes/ordenesAPI');
const ordenesProductosAPI = require('../ordenesProductos/ordenesProductosAPI');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      productos: '/productos',
      usuarios: '/usuarios',
      clientes: '/clientes',
      auth: '/auth',
      email: '/email',
      ordenes: '/ordenes',
      ordenesProductos: '/ordenesProductos',
    };

    // Conectar BBDD
    this.conectarBD();

    // Middlewares
    this.middlewares();

    // Rutas aplicacion
    this.routes();
  }

  conectarBD() {
    dbConnection();
  }

  middlewares() {
    // parse application/json
    this.app.use(express.json());

    // parse application/x-www-form-urlencoded
    this.app.use(express.urlencoded({ extended: false }));

    // CORS
    this.app.use(cors());

    // cookies
    this.app.use(cookieParser());

    // Public
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.auth, authAPI);
    this.app.use(this.paths.productos, productosAPI);
    this.app.use(this.paths.usuarios, usuariosAPI);
    this.app.use(this.paths.clientes, clientesAPI);
    this.app.use(this.paths.email, emailAPI);
    this.app.use(this.paths.ordenes, ordenesAPI);
    this.app.use(this.paths.ordenesProductos, ordenesProductosAPI);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en el puerto ', this.port);
    });
  }
}

module.exports = Server;
