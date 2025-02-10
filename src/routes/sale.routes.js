import { Router } from "express";
import { registrarVenta } from "../controllers/sale.controller.js";


const router = Router();

router.post('/sale', registrarVenta)


export default router;