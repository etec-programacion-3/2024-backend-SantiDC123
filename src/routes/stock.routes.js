import { Router } from "express";
import { listarHistorialStock, listarHistorialStockPorProducto } from "../controllers/stock.controller.js";

const router = Router();

router.get('/stock/historial', listarHistorialStock)
router.get('/stock/historial/:producto', listarHistorialStockPorProducto)
export default router;