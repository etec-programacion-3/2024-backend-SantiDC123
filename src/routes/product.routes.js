import { Router } from "express";
import { crearProducto, listarDetalleProducto, listarProductos } from "../controllers/product.controller.js";

const router = Router();

router.post('/product', crearProducto)

router.get('/product', listarProductos)
router.get('/product/detail/:id', listarDetalleProducto)

export default router;