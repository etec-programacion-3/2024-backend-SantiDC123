import { Router } from "express";
import { crearProducto, listarProductos } from "../controllers/product.controller.js";

const router = Router();

router.post('/product', crearProducto)
router.get('/product', listarProductos)
export default router;