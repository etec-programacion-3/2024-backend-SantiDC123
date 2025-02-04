import { Router } from "express";
import { cerrarSesionUsuario, loginUsuario, registrarUsuario, verificarToken } from "../controllers/user.controller.js";

const router = Router();

router.post('/registro', registrarUsuario)

router.post('/login', loginUsuario)

router.post('/logout', cerrarSesionUsuario)


router.get('/verificar', verificarToken)
export default router;