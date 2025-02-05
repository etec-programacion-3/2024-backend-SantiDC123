import { Router } from "express";
import { actualizarCarrito, cerrarSesionUsuario, loginUsuario, obtenerCarrito, registrarUsuario, verificarToken } from "../controllers/user.controller.js";

const router = Router();

router.post('/registro', registrarUsuario)

router.post('/login', loginUsuario)

router.post('/logout', cerrarSesionUsuario)


router.get('/verificar', verificarToken)

router.post('/carrito', actualizarCarrito)
router.get('/carrito', obtenerCarrito)
export default router;