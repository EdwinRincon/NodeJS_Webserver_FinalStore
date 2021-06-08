const { Router } = require("express");
const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autentificacion");

const {
  getProductos,
  getProducto,
  postProducto,
  putProducto,
  deleteProducto,
  getTotalProductos,
} = require("../controllers/productos.js");

const router = Router();

/**
 * {{url}}/productos
 *
 */
router.get("/", getProductos); // Obtener todos los productos
router.get("/:name", getProducto); // Obtener 1 producto
router.post("/", verificaToken, postProducto); // Crear producto
router.put("/:name", [verificaToken, verificaAdmin_Role], putProducto); // Actualizar producto
router.delete("/:name", [verificaToken, verificaAdmin_Role], deleteProducto); // Eliminar producto definitivamente de la BBDD (putProducto AVAILABLE: false. para no elimiarno pero cambiar su estado)
router.get("/total/n", getTotalProductos); // Numero total de productos (AVAILABLE: true & false)

module.exports = router;
