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
router.get("/", getProductos);
router.get("/:name", getProducto);
router.post("/", verificaToken, postProducto);
router.put("/:name", [verificaToken, verificaAdmin_Role], putProducto);
router.delete('/:name', [verificaToken, verificaAdmin_Role], deleteProducto);
router.get('/total', getTotalProductos);

module.exports = router;