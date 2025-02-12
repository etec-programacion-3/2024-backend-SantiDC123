import { Router } from "express";
import { listarDetalleVenta, listarVentasCliente, registrarVenta } from "../controllers/sale.controller.js";


const router = Router();

router.post('/sale', registrarVenta)
router.get('/sale/client', listarVentasCliente)
router.get('/sale/detail/:id', listarDetalleVenta)


export default router;