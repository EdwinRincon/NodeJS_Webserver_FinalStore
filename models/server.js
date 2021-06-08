const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { dbConnection } = require('../database/config');


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      productos: '/productos',
      usuarios: '/usuarios',
      auth: '/auth',
      email: '/email',
    };

    // Conectar BBDD
    this.conectarBD();

    // Middlewares
    this.middlewares();

    // Rutas aplicacion
    this.routes();
  }

  async conectarBD() {
    await dbConnection();
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
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.email, require('../routes/send-email'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en el puerto ', this.port);
    });
  }
}

module.exports = Server;
