import { Router } from "express";
import { cerrarSesionUsuario, loginUsuario, registrarUsuario } from "../controllers/user.controller.js";

const router = Router();

router.post('/registro', registrarUsuario)

router.post('/login', loginUsuario)

router.post('/logout', cerrarSesionUsuario)
export default router;