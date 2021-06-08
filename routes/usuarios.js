const { Router } = require("express");
const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autentificacion");

const {
  getUsuarios,
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
} = require("../controllers/usuarios.js");

const router = Router();

/**
 * {{url}}/usuarios
 */
router.get("/", [verificaToken, verificaAdmin_Role], getUsuarios); // Obtener todos los usuarios
router.get("/:email", [verificaToken, verificaAdmin_Role], getUsuario); // Obtener 1 usuario
router.post("/", [verificaToken, verificaAdmin_Role], postUsuario); // Crear nuevo usuario
router.put("/:email", [verificaToken, verificaAdmin_Role], putUsuario); // Actualizar usuario
router.delete("/:email", [verificaToken, verificaAdmin_Role], deleteUsuario); // Eliminar usuario

module.exports = router;
